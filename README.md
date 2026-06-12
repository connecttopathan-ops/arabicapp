# MASAR

A mobile app for learning **Modern Standard Arabic**, reading-first, for
English-speaking beginners. Built with Expo (React Native) + TypeScript +
Expo Router.

This is the first static version: real UI, placeholder data, ready to wire up
a Supabase backend later.

---

## Run it on your phone (Expo Go)

1. **Install Expo Go** on your phone (iOS App Store or Google Play).
2. In this folder on your computer, start the dev server:
   ```bash
   npm install      # first time only
   npx expo start
   ```
3. A QR code appears in the terminal.
   - **iPhone:** open the Camera app, point it at the QR code, tap the banner.
   - **Android:** open Expo Go, tap "Scan QR code", scan it.
4. The app loads on your phone. Edit a file, save, and it reloads instantly.

> Phone and computer must be on the **same Wi-Fi**. If the QR won't connect,
> run `npx expo start --tunnel` instead (slower, but works across networks).

Press `i` (Mac + Xcode) or `a` (Android emulator) in the terminal to open a
simulator instead of a physical device.

---

## Project structure

```
app/                      # Screens — file-based routing (Expo Router)
  _layout.tsx             # Root: loads fonts, theme, navigation stack
  (tabs)/
    _layout.tsx           # Bottom tab bar (Home, Course, Lesson, Profile)
    index.tsx             # Home (fully built)
    course.tsx            # Placeholder
    lesson.tsx            # Placeholder
    profile.tsx           # Placeholder

src/
  theme/                  # Design system: the single source of truth
    colors.ts             #   palette, jewel tones, semantic colours
    typography.ts         #   fonts + text style presets
    layout.ts             #   spacing, radius, elevation
    fonts.ts              #   font asset map for loading
    index.ts              #   `import { theme } from '@/theme'`
  components/             # Reusable UI (HeroCard, TopicTile, Card, ...)
  types/                  # Domain types (UserProgress, Topic, ...)
  data/                   # Hardcoded placeholder content (swap-out point)
  services/               # contentService — the seam to the backend
  hooks/                  # useHomeData — load data into screens
```

The `@/` import alias points at `src/` (configured in `tsconfig.json`).

## Adding Supabase later

The app is structured so the backend swap touches **one layer**:

- Screens call hooks (`useHomeData`), which call `src/services/contentService.ts`.
- Today those service functions return data from `src/data/`.
- To go live, install `@supabase/supabase-js`, create a client, and replace
  the **bodies** of the service functions with real queries. The function
  signatures are already `async` and typed, so no screen or component changes.

## Design system at a glance

- **Theme:** warm dark "espresso" (`#1A1512`) with ivory text, gold + teal accents.
- **Topic tiles:** five jewel tones (teal, saffron, terracotta, indigo, aubergine).
- **Fonts:** Marcellus (display serif), Figtree (body sans), Noto Naskh Arabic
  (renders right-to-left via the `<ArabicText>` component).

## Building an installable APK (Android)

The app builds in the cloud with **EAS Build** (free tier). You need a free
Expo account — no Android SDK required on your machine.

```bash
# 1. Create a free account at https://expo.dev, then log in:
npx eas-cli login

# 2. First time only — links this project to your Expo account:
npx eas-cli init

# 3. Build an installable APK (the "preview" profile in eas.json):
npx eas-cli build -p android --profile preview
```

When the build finishes, EAS prints a URL (and a QR code). Open it on your
Android phone to download the `.apk`, then install it — you may need to allow
"Install from unknown sources" the first time.

Build profiles live in `eas.json`:
- **preview** → `.apk` for sideloading / sharing with testers
- **production** → `.aab` (Android App Bundle) for the Google Play Store

> iOS note: installable iOS builds require an Apple Developer account ($99/yr).
> Until then, use Expo Go for iPhone testing.

## Useful commands

```bash
npx expo start          # dev server + QR code
npx tsc --noEmit        # typecheck
npx expo start --tunnel # dev server over a tunnel (different networks)
```
