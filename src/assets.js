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

  // Images pour la galerie finale (Écran 6)
  // Remplace par tes propres photos !
  gallery: [
    { src: '/assets/gifs/photo1.gif', alt: 'Notre moment 1' },
    { src: '/assets/gifs/photo2.gif', alt: 'Notre moment 2' },
    { src: '/assets/gifs/photo3.gif', alt: 'Notre moment 3' },
    { src: '/assets/gifs/photo4.gif', alt: 'Notre moment 4' },
    { src: '/assets/gifs/photo5.gif', alt: 'Notre moment 5' },
    { src: '/assets/gifs/photo6.gif', alt: 'Notre moment 6' },
  ],

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
