// Suno API abstraction. In demo mode (no SUNO_API_KEY), returns a stub URL.
// TODO: brancher la vraie API Suno lorsque la clé est fournie.

const DEMO_AUDIO_URL = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export interface SunoJob {
  jobId: string;
  audioUrl?: string;
  coverUrl?: string;
  demo: boolean;
}

export async function submitSunoJob(params: {
  prompt: string;
  style: string;
  title: string;
  callbackUrl: string;
}): Promise<SunoJob> {
  const apiKey = process.env.SUNO_API_KEY;
  if (!apiKey) {
    return {
      jobId: `demo-${crypto.randomUUID()}`,
      audioUrl: DEMO_AUDIO_URL,
      coverUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800",
      demo: true,
    };
  }
  const res = await fetch("https://api.sunoapi.org/api/v1/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      prompt: params.prompt,
      style: params.style,
      title: params.title,
      customMode: true,
      instrumental: false,
      model: "V4",
      callBackUrl: params.callbackUrl,
    }),
  });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`Suno API error ${res.status}: ${txt}`);
  }
  const data = (await res.json()) as { data?: { taskId?: string } };
  return { jobId: data.data?.taskId ?? crypto.randomUUID(), demo: false };
}
