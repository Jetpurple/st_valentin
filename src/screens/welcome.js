/**
 * Écran 1 — Accueil animé
 * Titre romantique (typing + glow), fond animé, bouton "Commencer"
 */

import gsap from 'gsap';
import { CONTENT } from '../content.js';
import { router } from '../router.js';
import { audioManager } from '../utils/audio.js';
import { createElement, typeWriter, confettiHearts } from '../utils/helpers.js';
import { getFlirtyLine } from '../utils/getFlirtyLine.js';
import { showFlirtyToast } from '../utils/toast.js';

export function createWelcomeScreen() {
  const { title, subtitle, startButton, soundButton } = CONTENT.welcome;

  const screen = createElement('div', 'screen welcome-screen');

  // Emoji animé
  const emoji = createElement('div', 'screen-emoji heartbeat', { textContent: '💖' });

  // Titre
  const titleEl = createElement('h1', 'screen-title glow-text typing-cursor');
  titleEl.setAttribute('aria-label', title);

  // Sous-titre
  const subtitleEl = createElement('p', 'screen-subtitle');
  subtitleEl.style.opacity = '0';
  subtitleEl.textContent = subtitle;

  // Boutons
  const buttonsDiv = createElement('div', 'welcome-buttons');
  buttonsDiv.style.opacity = '0';

  const startBtn = createElement('button', 'btn btn--large btn--pulse', { textContent: startButton });
  const soundBtn = createElement('button', 'btn btn--outline', { textContent: soundButton });

  buttonsDiv.appendChild(startBtn);
  buttonsDiv.appendChild(soundBtn);

  screen.appendChild(emoji);
  screen.appendChild(titleEl);
  screen.appendChild(subtitleEl);
  screen.appendChild(buttonsDiv);

  // Animations à l'apparition
  requestAnimationFrame(async () => {
    // Typing effect sur le titre
    await typeWriter(titleEl, title, 60);
    titleEl.classList.remove('typing-cursor');

    // Fade in sous-titre
    gsap.to(subtitleEl, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: 0.2,
      ease: 'power2.out',
    });

    // Fade in boutons
    gsap.fromTo(buttonsDiv,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.5, ease: 'power2.out' }
    );

    // Toast de bienvenue taquin (après les animations)
    setTimeout(() => {
      showFlirtyToast(getFlirtyLine('welcome', 0.7));
    }, 1800);
  });

  // Événement — Commencer
  startBtn.addEventListener('click', (e) => {
    const rect = startBtn.getBoundingClientRect();
    confettiHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 25);

    gsap.to(startBtn, {
      scale: 1.1,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      onComplete: () => {
        router.next();
      },
    });
  });

  // Événement — Son
  soundBtn.addEventListener('click', () => {
    const isMuted = audioManager.toggle();
    soundBtn.textContent = isMuted ? soundButton : '🔇 Couper le son';

    const soundTopBtn = document.getElementById('btn-sound');
    audioManager.updateButton(soundTopBtn);
  });

  return screen;
}
