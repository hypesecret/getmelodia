import type { SupabaseClient } from "@supabase/supabase-js";
import { submitSunoJob } from "./suno.server";

export async function runSunoForSong(supabase: SupabaseClient, songId: string) {
  const { data: song, error } = await supabase.from("songs").select("*").eq("id", songId).maybeSingle();
  if (error) throw error;
  if (!song) throw new Error("Chanson introuvable");

  const origin = process.env.PUBLIC_APP_URL ?? "https://project--6779d784-ea44-4954-95b9-7079eb4c4b83.lovable.app";
  const callbackUrl = `${origin}/api/public/webhooks/suno`;

  const job = await submitSunoJob({
    prompt: song.prompt ?? "",
    style: song.style ?? "",
    title: song.title ?? "Ma chanson",
    callbackUrl,
  });

  if (job.demo && job.audioUrl) {
    await supabase
      .from("songs")
      .update({
        audio_url: job.audioUrl,
        cover_url: job.coverUrl,
        duration: 180,
        status: "ready",
        suno_job_id: job.jobId,
      })
      .eq("id", song.id);
    await supabase.from("song_orders").update({ status: "ready" }).eq("id", song.order_id);
  } else {
    await supabase.from("songs").update({ suno_job_id: job.jobId, status: "generating" }).eq("id", song.id);
  }
  return { jobId: job.jobId, demo: job.demo };
}
