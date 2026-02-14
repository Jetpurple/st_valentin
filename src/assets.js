/**
 * assets.js — Configuration des assets (images, GIFs, audio)
 * Modifie les chemins pour utiliser tes propres photos/GIFs
 */

export const ASSETS = {
  // GIFs décoratifs (utilisés sur différents écrans)
  gifs: {
    hearts: '/assets/gifs/hearts.gif',
    love: '/assets/gifs/love.gif',
    celebrate: '/assets/gifs/celebrate.gif',
    kiss: '/assets/gifs/kiss.gif',
    hug: '/assets/gifs/hug.gif',
    dance: '/assets/gifs/dance.gif',
  },

  // Images pour la galerie finale (Écran 6) — Nos souvenirs 💕
  gallery: Array.from({ length: 48 }, (_, i) => ({
    src: `/assets/souvenirs/photo${i + 1}.jpg`,
    alt: `Notre souvenir ${i + 1}`,
  })),

  // Fallback emojis quand les images ne sont pas trouvées
  fallbackEmojis: ['💑', '💕', '🌹', '💖', '🥰', '✨'],

  // Audio
  audio: {
    bgMusic: '/assets/audio/background.mp3',
  },

  // Lottie (optionnel)
  lottie: {
    hearts: '/assets/lottie/hearts.json',
    confetti: '/assets/lottie/confetti.json',
  },
};
