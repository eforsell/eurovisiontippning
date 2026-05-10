import { supabase } from "../lib/supabase";

export const adminService = {
  async importEntriesFromJson(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    jsonData: any[],
    yearId: string
  ): Promise<{ error: Error | null; success: boolean }> {
    try {
      const { error: delErr } = await supabase
        .from("entries")
        .delete()
        .eq("year_id", yearId);

      if (delErr) {
        throw new Error(`Failed to clean old entries: ${delErr.message}`);
      }

      const { error: insErr } = await supabase
        .from("entries")
        .insert(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          jsonData.map((item: any) => ({
            country: item.country,
            artist: item.artist,
            song_title: item.song_title,
            start_position: item.start_position,
            starting_contest: item.starting_contest,
            youtube_id: item.youtube_id || null,
            year_id: yearId
          }))
        );

      if (insErr) {
        throw new Error(`Failed to insert entries: ${insErr.message}`);
      }

      return { success: true, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      return { success: false, error: err };
    }
  },
};
