# Refonte UX Mélodia — "Une seule app, un seul parcours"

## Nouveau modèle mental
> Décris → l'IA compose → tu écoutes → tu partages.

Tout le reste (packs, wizard, paiement, dashboard SaaS) devient invisible ou disparaît.

## Nouvelle arborescence (4 routes visibles)

```
/            Accueil (Hero + Magic Input + suggestions + dernières créations + comment ça marche + tarifs)
/create      Conversation IA (chat, pas de wizard)
/generate/$id  Animation premium pendant Suno
/song/$id    Player + lyrics + partage WhatsApp + télécharger
/library     Mes chansons (style Spotify : recherche, filtres, favoris)
/profile     Compte (profil, abonnement, parrainage, déconnexion)
```

Bottom-nav mobile (toujours visible, 4 items) :
- 🏠 Accueil `/`
- ✨ Créer `/create`
- 🎵 Mes chansons `/library`
- 👤 Compte `/profile`

## Routes supprimées / redirigées
- `/packs` → redirige `/create` (les occasions deviennent des chips-suggestions dans le chat, pas une étape)
- `/creer/$pack` → redirige `/create?occasion=...` (le wizard 10 étapes disparaît complètement)
- `/dashboard/*` → redirigent vers `/library` ou `/profile`
- `/dashboard/creations` → `/library`
- `/dashboard/creations/$songId` → `/song/$songId`
- `/dashboard/historique` → `/profile`
- `/dashboard/parrainage` → `/profile` (section)
- `/magic` → fusionné dans `/generate/$id`
- `/paiement/$orderId` → gardé mais présenté comme un simple modal/écran de confirmation, hors nav

## Détails par écran

### / (Accueil)
Un seul objectif : faire comprendre. Hero minimal + Magic Input géant + 6 suggestions cliquables (Papa, Maman, Anniversaire, Mariage, Ami, Autre). Bandeau "3 dernières créations publiques" (mock ok). Section "Comment ça marche" 3 étapes. Section tarifs (3 packs : Découverte, Signature, Légende). Pas de CTA compétitifs — un seul.

### /create (Conversation IA)
Interface chat plein écran type ChatGPT.
- Bulle IA : "Décris la chanson que tu veux créer."
- Utilisateur répond (texte ou micro).
- L'IA extrait ce qu'elle a et pose 2-3 questions max (destinataire, souvenir, style/vibe) — pas 10.
- Progression discrète en haut (3 étapes max).
- Bouton "C'est bon, générer" apparaît quand l'IA a assez d'infos.
- Réutilise `startMagicOrder` en arrière-plan → navigue vers `/generate/$id`.

### /generate/$id (Animation premium)
Séquence animée avec 5 phases : Analyse → Ghostwriter → Composition → Voix → Mix. Chaque phase ~5-10s, transitions fluides, tokens couleurs Mélodia. Auth check → paiement (simulé) → poll status. Quand `ready` → redirige `/song/$id`.

### /song/$id (Player émotionnel)
Grande cover (carré 1:1), player audio custom (play/pause, timeline, waveform léger), titre + destinataire, tabs "Paroles" / "Détails", 3 actions : Partager WhatsApp (deeplink), Télécharger, Créer une variante.

### /library
Style Spotify Mobile. Header "Mes chansons" + recherche. Filtres chips (Toutes / En cours / Terminées / ♡ Favoris). Liste dense avec cover 56px + titre + statut + play inline.

### /profile
Sections : Profil (nom, whatsapp), Abonnement (pack actif + upgrade), Parrainage (code + partage), Déconnexion. Pas de sidebar SaaS.

## Design system unifié — Apple Music × Suno × ElevenLabs
- Palette : #0a0806 bg, #111010 cards, ring white/5, accent ambré (token existant).
- Typo : garder celle en place, poids medium partout, tracking-tight sur titres.
- Boutons : arrondi full, accent solide primary, ghost white/[0.03] secondaire.
- Cards : rounded-2xl, ring white/5, hover ring accent/40.
- Suppression stricte des styles hétéroclites (charts SaaS, sidebars Notion).

## Composants partagés
- `<AppShell>` conservé mais simplifié (top bar minimal + bottom nav uniquement).
- `<BottomNav>` mis à jour avec les 4 items ci-dessus.
- Nouveau `<Composer>` pour /create (input chat + micro).
- Nouveau `<GenerationStages>` pour /generate.
- Nouveau `<SongPlayer>` pour /song.
- Nouveau `<SongRow>` pour /library.

## Backend
Aucun changement de schéma. Réutilise :
- `startMagicOrder` (magic.functions) pour la conversation.
- `simulatePayment` + `listMySongs` + `getSong` existants.
- `orders.functions` inchangés.

## Fichiers
**Nouveaux :**
- `src/routes/create.tsx`
- `src/routes/generate.$id.tsx`
- `src/routes/song.$id.tsx`
- `src/routes/library.tsx`
- `src/routes/profile.tsx`
- `src/components/create/Composer.tsx`
- `src/components/create/ChatBubble.tsx`
- `src/components/generate/GenerationStages.tsx`
- `src/components/song/SongPlayer.tsx`
- `src/components/library/SongRow.tsx`

**Modifiés :**
- `src/routes/index.tsx` (refonte hero + suggestions + comment ça marche + tarifs unifiés)
- `src/components/ui-shell/BottomNav.tsx` (4 items nouveaux)
- `src/components/ui-shell/AppShell.tsx` (simplification)
- `src/routes/__root.tsx` (rien à changer)

**Redirections (routes gardées mais vides / redirect) :**
- `src/routes/packs.tsx` → `<Navigate to="/create" />`
- `src/routes/creer.$pack.tsx` → `<Navigate to="/create" search={{ occasion: params.pack }} />`
- `src/routes/magic.tsx` → `<Navigate to="/generate/$id" />`
- `src/routes/_authenticated/dashboard.tsx` → refactor en simple `<Outlet />` (ou supprimé)
- `src/routes/_authenticated/dashboard.creations.tsx` → `<Navigate to="/library" />`
- `src/routes/_authenticated/dashboard.creations.$songId.tsx` → `<Navigate to="/song/$songId" />`
- `src/routes/_authenticated/dashboard.historique.tsx` → `<Navigate to="/profile" />`
- `src/routes/_authenticated/dashboard.parrainage.tsx` → `<Navigate to="/profile" />`
- `src/routes/_authenticated/dashboard.index.tsx` → `<Navigate to="/library" />`

`/library`, `/song/$id`, `/profile` passent sous `_authenticated` pour hériter du gate existant.

## Ce qui n'est PAS dans ce plan
- Pas de refonte visuelle des tokens de couleur (déjà bons).
- Pas de nouveau modèle Suno / IA.
- Pas de nouveau flux de paiement (simulé, comme aujourd'hui).
- Pas de changement des tables / migrations.

Une fois validé, je fais tout en une passe.
