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
      key: config.ANON_KEY,
    };
  } catch (err) {
    console.error("Failed to get Supabase status:", err);
    process.exit(1);
  }
}

async function verifyAuth() {
  const { url, key } = getSupabaseConfig();
  const supabase = createClient(url, key);

  console.log("Testing authentication with test2@example.com...");

  // First attempt sign up
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: "test2@example.com",
    password: "password123",
  });

  if (signUpError && signUpError.message !== "User already registered") {
    console.error("❌ Auth sign-up failed:", signUpError);
    process.exit(1);
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "test2@example.com",
    password: "password123",
  });

  if (error) {
    console.error("❌ Auth verification failed:", error);
    process.exit(1);
  }

  if (data.session) {
    console.log("✅ Auth verification successful! Session retrieved.");
    process.exit(0);
  } else {
    console.error("❌ Auth verification failed: No session retrieved.");
    process.exit(1);
  }
}

verifyAuth();
