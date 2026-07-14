import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

export const Route = createFileRoute("/api/public/webhooks/suno")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.SUNO_WEBHOOK_SECRET;
        const body = await request.text();

        // Signature verification is optional — sunoapi.org may not send HMAC headers
        if (secret && secret.trim() !== "") {
          const signature = request.headers.get("x-suno-signature") ?? "";
          const expected = createHmac("sha256", secret).update(body).digest("hex");
          const a = Buffer.from(signature);
          const b = Buffer.from(expected);
          if (a.length !== b.length || !timingSafeEqual(a, b)) {
            console.warn("[Suno Webhook] Invalid signature – rejecting");
            return new Response("Invalid signature", { status: 401 });
          }
        }

        let raw: Record<string, unknown>;
        try {
          raw = JSON.parse(body);
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }

        console.log("[Suno Webhook] Received payload:", JSON.stringify(raw).slice(0, 500));

        // sunoapi.org wraps the payload in a `data` envelope or sends it flat
        // Support both: { data: { taskId, data: [...] } } and { taskId, data: [...] }
        type SunoTrack = { id?: string; audio_url?: string; image_url?: string; duration?: number; title?: string };
        const envelope = (raw.data ?? raw) as Record<string, unknown>;
        const taskId = (envelope.taskId ?? raw.taskId) as string | undefined;
        const tracks = (envelope.data ?? raw.data) as SunoTrack[] | undefined;
        const track = Array.isArray(tracks) ? tracks[0] : undefined;

        if (!taskId || !track?.audio_url) {
          console.log("[Suno Webhook] Missing taskId or audio_url, skipping:", { taskId, track });
          return new Response("ok", { status: 200 });
        }

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: song } = await supabaseAdmin
          .from("songs")
          .select("id, order_id, status")
          .eq("suno_job_id", taskId)
          .maybeSingle();

        if (!song) {
          console.warn("[Suno Webhook] No song found for taskId:", taskId);
          return new Response("ok", { status: 200 });
        }
        if (song.status === "ready") return new Response("ok", { status: 200 });

        await supabaseAdmin
          .from("songs")
          .update({
            audio_url: track.audio_url,
            cover_url: track.image_url ?? null,
            duration: track.duration ? Math.round(track.duration) : null,
            title: track.title ?? undefined,
            status: "ready",
          })
          .eq("id", song.id);

        await supabaseAdmin.from("song_orders").update({ status: "ready" }).eq("id", song.order_id);

        console.log("[Suno Webhook] Song ready:", song.id, "audio:", track.audio_url);
        return new Response("ok", { status: 200 });
      },
    },
  },
});
