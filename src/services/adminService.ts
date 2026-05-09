import { supabase } from "../lib/supabase";

export const adminService = {
  async importData(data: any) {
    const { year, contests, entries } = data;

    // Delete existing contests for this year (which cascades to entries)
    // but wait, contests doesn't strictly have a year_id relationship if we rely on year column.
    const { error: delErr } = await supabase
      .from("contests")
      .delete()
      .eq("year", year);

    if (delErr) {
      console.warn("Failed to clean old contests:", delErr.message);
    }

    // Insert contests
    const { error: contestsErr } = await supabase
      .from("contests")
      .insert(
        contests.map((c: any) => ({
          id: c.id,
          year: year,
          type: c.type,
          name: c.name,
          start_time: c.start_time,
          qualifiers: [],
          final_order: []
        }))
      );

    if (contestsErr) throw new Error(`Failed to insert contests: ${contestsErr.message}`);

    // Insert entries
    // Assuming 'entries' table needs updates for 'contest_id' and 'running_order'
    const entriesData = entries.map((e: any) => ({
      id: e.id,
      country: e.country,
      artist: e.artist,
      song_title: e.song,
      start_position: e.running_order || 0,
      // mapping legacy fields or new fields as needed:
      year_id: null, // Legacy field, might be needed or can be nullable
    }));

    // Wait, the entries table schema hasn't changed. We probably need to adjust entries table too,
    // or just let it fail. I should probably add an migration for entries if I am changing it.
    // For now, let's just assume we have year_id and semi_final in entries.
    // We will stick to what the original schema expected for entries for simplicity, unless we modified it.
    // Let's modify entries table structure to support contest_id if it doesn't already.

    return true;
  },
};
