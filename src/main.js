/**
 * main.js — Point d'entrée de l'application Saint-Valentin 💖
 * Initialise le router, les particules, l'audio et les écrans
 */

import gsap from 'gsap';
import { router } from './router.js';
import { particleSystem } from './utils/particles.js';
import { audioManager } from './utils/audio.js';

// Import des écrans
import { createWelcomeScreen } from './screens/welcome.js';
import { createValentineScreen } from './screens/valentine.js';
import { createCatchHeartsScreen } from './screens/catchHearts.js';
import { createQuizScreen } from './screens/quiz.js';
import { createMemoryScreen } from './screens/memory.js';
import { createFinalScreen } from './screens/final.js';

// ===========================
// Initialisation au chargement
// ===========================
document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  // Éléments du DOM
  const topbar = document.getElementById('topbar');
  const btnBack = document.getElementById('btn-back');
  const btnSound = document.getElementById('btn-sound');
  const progressFill = document.getElementById('progress-fill');
  const progressText = document.getElementById('progress-text');

  // --- Initialise les particules de fond ---
  particleSystem.init('particles-canvas');

  // --- Initialise le router ---
  router.init('app');

  // Enregistre les écrans (fonctions qui retournent un élément DOM)
  router.registerScreens([
    createWelcomeScreen,     // 0 — Accueil
    createValentineScreen,   // 1 — Valentine
    createCatchHeartsScreen, // 2 — Attrape les cœurs
    createQuizScreen,        // 3 — Quiz
    createMemoryScreen,      // 4 — Memory
    createFinalScreen,       // 5 — Final
  ]);

  // Callback de changement d'écran
  router.onScreenChange = (index, total) => {
    // Affiche/cache la topbar
    if (index === 0) {
      topbar.classList.add('hidden');
    } else {
      topbar.classList.remove('hidden');
    }

    // Met à jour la barre de progression
    const percent = ((index) / (total - 1)) * 100;
    gsap.to(progressFill, { width: `${percent}%`, duration: 0.6, ease: 'power2.out' });
    progressText.textContent = `${index + 1}/${total}`;
  };

  // --- Bouton retour ---
  btnBack.addEventListener('click', () => {
    router.prev();
  });

  // --- Bouton son ---
  btnSound.addEventListener('click', () => {
    audioManager.toggle();
    audioManager.updateButton(btnSound);
  });

  // Initialise l'état du bouton son
  audioManager.updateButton(btnSound);

  // --- Démarre le premier écran ---
  router.goTo(0);

  // --- Animation d'entrée globale ---
  gsap.fromTo('body', { opacity: 0 }, { opacity: 1, duration: 0.8, ease: 'power2.out' });

  console.log('💖 Saint-Valentin — Site initialisé !');
  console.log('📝 Personnalise le contenu dans /src/content.js');
  console.log('🖼️ Ajoute tes photos dans /public/assets/gifs/');
  console.log('🎵 Ajoute ta musique dans /public/assets/audio/background.mp3');
}
