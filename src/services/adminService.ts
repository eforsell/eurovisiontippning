import { supabase } from "../lib/supabase";

export interface AdminImportData {
  year: number;
  semi1_start: string;
  semi2_start: string;
  final_start: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  entries: Array<{
    country: string;
    artist: string;
    song_title: string;
    start_position: number;
    semi_final: 1 | 2 | null;
    youtube_id?: string;
  }>;
}

export const adminService = {
  async importData(data: AdminImportData) {
    const { entries, ...yearData } = data;

    // Upsert year
    const { data: yearRes, error: yearErr } = await supabase
      .from("years")
      .upsert(yearData, { onConflict: "year" })
      .select("id")
      .single();

    if (yearErr) throw new Error(`Failed to upsert year: ${yearErr.message}`);

    const yearId = yearRes.id;

    // Delete existing entries for this year
    const { error: delErr } = await supabase
      .from("entries")
      .delete()
      .eq("year_id", yearId);

    if (delErr)
      throw new Error(`Failed to clean old entries: ${delErr.message}`);

    // Insert new entries
    const entriesData = entries.map((e) => ({
      ...e,
      year_id: yearId,
    }));

    const { error: entriesErr } = await supabase
      .from("entries")
      .insert(entriesData);

    if (entriesErr)
      throw new Error(`Failed to insert entries: ${entriesErr.message}`);

    return true;
  },
};
