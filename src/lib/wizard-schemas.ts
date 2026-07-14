import { z } from "zod";

export const questionnaireSchema = z.object({
  pack_slug: z.string().min(1),
  occasion: z.string().min(1),
  destinataire: z.string().trim().min(1, "Prénom requis").max(80),
  lien: z.string().trim().max(80).optional().default(""),
  age: z.string().trim().max(20).optional().default(""),
  souvenirs: z.string().trim().min(10, "Racontez au moins un souvenir").max(1500),
  emotion: z.string().min(1),
  style: z.string().min(1),
  langue: z.string().min(1),
  narrateur: z.string().trim().min(1, "Votre prénom").max(80),
  message: z.string().trim().max(500).optional().default(""),
});

export type Questionnaire = z.infer<typeof questionnaireSchema>;

export function buildSummary(q: Questionnaire): string {
  return [
    `Occasion: ${q.occasion}`,
    `Pour: ${q.destinataire}${q.lien ? ` (${q.lien})` : ""}${q.age ? `, ${q.age}` : ""}`,
    `Émotion: ${q.emotion}`,
    `Style: ${q.style} · Langue: ${q.langue}`,
    `Narrateur: ${q.narrateur}`,
    `Souvenirs: ${q.souvenirs}`,
    q.message ? `Message: ${q.message}` : "",
  ].filter(Boolean).join("\n");
}
