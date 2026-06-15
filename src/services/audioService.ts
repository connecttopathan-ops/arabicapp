/**
 * Audio service — speaks a Course item aloud.
 *
 * One entry point, `playAudio`, with a built-in fallback:
 *   - If the item has a recorded `audioUrl` (e.g. an ElevenLabs file linked
 *     from Supabase), play that file.
 *   - Otherwise, use the device's text-to-speech in Arabic.
 *
 * Swapping device TTS for recordings later is just a matter of populating the
 * `audio_url` column — no UI or call-site changes needed.
 */
import * as Speech from 'expo-speech';
import { createAudioPlayer, setAudioModeAsync, type AudioPlayer } from 'expo-audio';

let configured = false;
let currentPlayer: AudioPlayer | null = null;
let audioEnabled = true;

/** Toggle audio playback app-wide (driven by user settings). */
export function setAudioEnabled(enabled: boolean) {
  audioEnabled = enabled;
  if (!enabled) stopCurrent();
}

async function ensureConfigured() {
  if (configured) return;
  configured = true;
  try {
    // Play even when the device is on silent.
    await setAudioModeAsync({ playsInSilentMode: true });
  } catch {
    // Non-fatal: audio still plays with default mode.
  }
}

function stopCurrent() {
  Speech.stop();
  if (currentPlayer) {
    try {
      currentPlayer.remove();
    } catch {
      // ignore
    }
    currentPlayer = null;
  }
}

interface PlayAudioOptions {
  /** Recorded audio file URL, if one exists for this item. */
  audioUrl?: string | null;
  /** Arabic text to speak via TTS when there's no recording. */
  text: string;
}

export async function playAudio({ audioUrl, text }: PlayAudioOptions): Promise<void> {
  if (!audioEnabled) return; // respects the app-wide audio setting
  await ensureConfigured();
  stopCurrent(); // never overlap two sounds

  if (audioUrl) {
    const player = createAudioPlayer({ uri: audioUrl });
    currentPlayer = player;
    player.play();
    return;
  }

  Speech.speak(text, {
    language: 'ar', // Modern Standard Arabic
    rate: 0.9,
  });
}
