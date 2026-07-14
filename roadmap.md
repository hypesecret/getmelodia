# Mélodia — Source of Truth (verrouillée)

> Ce fichier est la référence absolue pour toutes les itérations futures. Toute
> évolution produit / UX / prompt Suno doit s'y aligner ou le mettre à jour.

## 1. Vision produit — "Invisible Studio"

L'utilisateur mainstream ne sait pas prompter. Mélodia est une expérience zéro-friction :
il parle ou tape librement, le moteur configure automatiquement toute la puissance de
Suno Pro en arrière-plan. Aucun jargon technique exposé par défaut.

## 2. Deux modes produit

### A. Magic One-Click (défaut mainstream)
- **Entrée** : texte libre ou mémo vocal ("Fais un morceau pour l'anniversaire de mon
  pote Thomas, vibe afro-pop énergique genre Naza - Sac à dos").
- **Traitement automatique** :
  1. Nettoyage des tics de langage / STT filler words.
  2. Détection de l'occasion.
  3. Écriture de paroles sur-mesure.
  4. Traduction des références d'artistes en tags musicaux techniques.
  5. Réglages Suno (vocal_gender, audio_influence, weirdness) posés seuls.
- **UI** : gros champ + micro visible dès l'accueil.

### B. Studio Pro (avancé)
- Panneau "Réglages avancés" dépliable dans le wizard.
- Overrides exposés : vocal_gender (male/female/duet), persona sauvegardée,
  slider Originality (mappe sur weirdness Suno), upload d'un morceau de référence.

## 3. Règles de production musique & paroles (CRITIQUE)

### prompt_style (Suno)
- **Max 120 caractères**, tags anglais séparés par virgules, **jamais de phrases**.
- **Jamais de noms d'artistes ni de titres directs** (Suno rejette). Toujours
  déconstruire en tags. Ex Naza → `afrobeat, french urban pop, danceable, upbeat, modern synth production, catchy rhythm`.

### suno_lyrics
- Écrites dans la **langue de la requête utilisateur** (français si prompt FR).
  Garder slang / idiomes locaux si demandés.
- Structure concise : **max 2 couplets, 2 refrains, 1 pont, 1 outro** pour éviter
  les coupures Suno mi-génération.
- **Injecter des tags de structure** entre crochets : `[Acoustic Intro]`, `[Verse 1]`,
  `[Chorus]`, `[Drop]`, `[Bridge]`, `[Melodic Outro]`.

### Safety pre-filter
- Substituer les marques / noms protégés par un équivalent générique avant l'appel
  Suno (évite les rejets copyright / hate speech).

### Weirdness auto-mapping (Magic mode)
- Hit standard demandé → weirdness 10-15.
- "expérimental / fou / unique / drôle" → weirdness 50-65.
- `style_influence` par défaut 50, `audio_influence` par défaut 30 sauf référence
  uploadée (=> 70).

## 4. Contrat de sortie JSON (orchestrateur)

Chaque appel Magic renvoie strictement ce payload :

```json
{
  "ui_layer": {
    "detected_occasion": "Anniversary",
    "detected_story_summary": "Chanson d'anniversaire pour Thomas, vibe énergique.",
    "loading_status_message": "Extraction du groove afrobeat de ta référence…"
  },
  "suno_payload": {
    "prompt_style": "afrobeat, french urban pop, danceable, upbeat, modern synth production, catchy rhythm",
    "vocal_gender": "male",
    "suno_lyrics": "[Verse 1]\n…\n[Chorus]\n…",
    "advanced_settings": {
      "weirdness": 15,
      "style_influence": 50,
      "audio_influence": 30
    },
    "persona_id": null,
    "inspiration_reference_track": null
  }
}
```

Aucun texte conversationnel autour de ce JSON.

## 5. Ajustements UI/UX permanents

1. **Micro visible dans le champ principal de l'accueil** (pas seulement dans
   "Prompt to Music" en dessous).
2. **Badges status** (Terminée / Brouillon / En cours) : contraste renforcé —
   fond opaque + texte foncé, lisible en plein soleil.
3. **Pack Légende** : mettre en avant les bénéfices exclusifs (génération
   ultra-rapide prioritaire, WAV Studio, licence commerciale, stems séparés,
   support prioritaire) pour justifier l'écart de prix.

## 6. Catalogues canoniques (verrouillés dans `src/lib/catalog.ts` & `src/lib/packs.ts`)

- **Styles** (15) : Rumba, Ndombolo, Afrobeat, Gospel, Rap, Trap, Hip-Hop, R&B,
  Pop, Amapiano, Makossa, Soukous, Acoustique, Piano, Jazz.
- **Langues** (5) : Français, Lingala, Kituba, Anglais, Mixte.
- **Occasions B2C** : Anniversaires, Couples, Mariages, Fiançailles, Demandes en
  mariage, Naissance, Baptême, Fête des mères, Fête des pères, Diplôme, Départ à
  la retraite, Hommage, Deuil, Diaspora.
- **Occasions B2B** : PME, Restaurants, Bars, Églises, Écoles, Radios, Marques,
  Influenceurs, Campagnes marketing, Événements.
- **Événement libre** : pack `autre` avec champ texte pour occasion custom.

## 7. Parcours utilisateur figé

```
Accueil (Magic input + micro) ──► Loading orchestrateur ──► Auth ──► Paiement ──► Dashboard/creations/$id
       │
       └─► (alternatif) /packs ──► /creer/$pack (wizard 10 étapes) ──► Auth ──► Paiement
```

## 8. Stack technique

- TanStack Start + Vite + React 19 + Tailwind v4.
- Lovable Cloud (Supabase managé) : `profiles`, `song_orders`, `songs`, `referrals`.
- IA : Lovable AI Gateway → `google/gemini-2.5-flash` (Magic + ghostwriter),
  `google/gemini-2.5-pro` pour le plan Légende.
- Suno via `src/lib/suno.server.ts` (fallback demo si pas de clé).
- PWA installable (manifest + icônes, pas de service worker).

## 9. Règles d'implémentation à respecter dans chaque itération

- Ne jamais écrire de couleurs hardcodées, utiliser les tokens sémantiques (`accent`, `--color-accent`, etc.).
- Toutes les nouvelles routes passent par `<AppShell>` + `<BottomNav>`.
- Nouveau server fn = zod input + `requireSupabaseAuth` sauf endpoint public documenté.
- Ne pas casser les catalogues (§6) — ils sont canoniques.
- Toute évolution du prompt Suno doit respecter §3.
