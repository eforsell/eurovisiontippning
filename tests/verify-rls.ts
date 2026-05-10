import { execSync } from "child_process";
import { createClient } from "@supabase/supabase-js";

function getSupabaseConfig() {
  try {
    const output = execSync("npx supabase status -o json", {
      encoding: "utf-8",
    });
    const config = JSON.parse(output);
    return {
      url: config.API_URL,
      anonKey: config.ANON_KEY,
      serviceKey: config.SERVICE_ROLE_KEY,
    };
  } catch (err) {
    console.error("Failed to get Supabase status:", err);
    process.exit(1);
  }
}

async function verifyRLS() {
  const { url, anonKey, serviceKey } = getSupabaseConfig();

  const adminClient = createClient(url, serviceKey);
  const user1Client = createClient(url, anonKey);
  const user2Client = createClient(url, anonKey);

  console.log("Setting up test data...");

  // 1. Create a year in the future
  const rndYear = 3000 + Math.floor(Math.random() * 1000);
  const { data: futureYear, error: yErr } = await adminClient
    .from("years")
    .insert({
      year: rndYear,
      semi1_start: `${rndYear}-05-13T19:00:00Z`,
      semi2_start: `${rndYear}-05-15T19:00:00Z`,
      final_start: `${rndYear}-05-17T19:00:00Z`,
      primary_color: "#000",
      secondary_color: "#fff",
    })
    .select("id")
    .single();

  if (yErr) {
    console.error("Failed to create year:", yErr);
    process.exit(1);
  }

  const { data: futureEntry } = await adminClient
    .from("entries")
    .insert({
      year_id: futureYear!.id,
      country: "Futureland",
      artist: "Robot",
      song_title: "Beep Boop",
      start_position: 1,
      semi_final: 1,
    })
    .select("id")
    .single();

  // 2. Login or create users
  console.log("Logging in/creating users...");

  const { error: err1 } = await adminClient.auth.admin.createUser({
    email: "u1@test.com",
    password: "password123",
    email_confirm: true,
  });
  if (err1 && err1.message !== "User already registered") {
    throw err1;
  }
  const { data: login1 } = await user1Client.auth.signInWithPassword({
    email: "u1@test.com",
    password: "password123",
  });
  const u1Id = login1.user!.id;

  const { error: err2 } = await adminClient.auth.admin.createUser({
    email: "u2@test.com",
    password: "password123",
    email_confirm: true,
  });
  if (err2 && err2.message !== "User already registered") {
    throw err2;
  }
  const { data: login2 } = await user2Client.auth.signInWithPassword({
    email: "u2@test.com",
    password: "password123",
  });
  const u2Id = login2.user!.id;

  // 3. User 1 makes a prediction on the future entry
  console.log("User 1 making prediction...");
  await user1Client.from("predictions").upsert({
    user_id: u1Id,
    entry_id: futureEntry!.id,
    is_qualifier: true,
    type: "semi1",
  });

  // 4. Ensure friendship is accepted
  console.log("Setting up friendship...");
  await user1Client
    .from("friends")
    .upsert({ user_id: u1Id, friend_id: u2Id, status: "pending" });
  await user2Client
    .from("friends")
    .update({ status: "accepted" })
    .eq("user_id", u1Id)
    .eq("friend_id", u2Id);

  // 5. User 2 tries to read User 1's prediction
  console.log(
    "User 2 attempting to read User 1 prediction (should be blocked by RLS)...",
  );
  const { data: spoofData } = await user2Client
    .from("predictions")
    .select("*")
    .eq("user_id", u1Id)
    .eq("entry_id", futureEntry!.id);

  if (spoofData && spoofData.length === 0) {
    console.log(
      "✅ RLS Anti-Spoil correctly blocked User 2 from seeing future prediction.",
    );
    process.exit(0);
  } else {
    console.error(
      "❌ RLS Anti-Spoil FAILED. User 2 could see the prediction:",
      spoofData,
    );
    process.exit(1);
  }
}

verifyRLS();