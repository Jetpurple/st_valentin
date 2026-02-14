/**
 * Écran 5 — Jeu Memory (cartes)
 * Grille de paires à retrouver avec animations flip GSAP
 */

import gsap from 'gsap';
import { CONTENT } from '../content.js';
import { router } from '../router.js';
import { updateData } from '../utils/storage.js';
import { createElement, confettiHearts, shuffleArray } from '../utils/helpers.js';
import { getFlirtyLine } from '../utils/getFlirtyLine.js';
import { showFlirtyToast } from '../utils/toast.js';

export function createMemoryScreen() {
  const { title, subtitle, pairs, successMessage } = CONTENT.memory;

  const screen = createElement('div', 'screen memory-screen');

  // Titre
  const titleEl = createElement('h2', 'screen-title', { textContent: title });
  const subtitleEl = createElement('p', 'screen-subtitle', { textContent: subtitle });

  // Grille
  const grid = createElement('div', 'memory-grid');

  screen.appendChild(titleEl);
  screen.appendChild(subtitleEl);
  screen.appendChild(grid);

  // Créer les paires (chaque image x2)
  const cards = shuffleArray([...pairs, ...pairs]);

  let flippedCards = [];
  let matchedCount = 0;
  let isChecking = false;
  const totalPairs = pairs.length;

  cards.forEach((item, index) => {
    const card = createElement('div', 'memory-card');
    card.dataset.cardId = item.id;
    card.dataset.index = index;

    const inner = createElement('div', 'memory-card-inner');
    const front = createElement('div', 'memory-card-front');
    const back = createElement('div', 'memory-card-back');

    // Créer l'image sticker
    const img = createElement('img', 'memory-card-img');
    img.src = item.src;
    img.alt = 'sticker';
    img.draggable = false;
    back.appendChild(img);

    inner.appendChild(front);
    inner.appendChild(back);
    card.appendChild(inner);

    // Animation d'apparition
    card.style.opacity = '0';
    card.style.transform = 'scale(0.5)';

    const handleFlip = (e) => {
      e.preventDefault();
      flipCard(card);
    };

    card.addEventListener('click', handleFlip);
    card.addEventListener('touchstart', handleFlip, { passive: false });

    grid.appendChild(card);
  });

  // Animer l'apparition des cartes
  requestAnimationFrame(() => {
    gsap.to(grid.querySelectorAll('.memory-card'), {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      stagger: 0.05,
      ease: 'back.out(1.5)',
    });
  });

  /** Retourne une carte */
  function flipCard(card) {
    // Ignorer si on vérifie, si la carte est déjà retournée ou matchée
    if (isChecking) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (flippedCards.length >= 2) return;

    card.classList.add('flipped');
    flippedCards.push(card);

    // Son de flip (via GSAP timeline)
    gsap.fromTo(card, { scale: 0.95 }, { scale: 1, duration: 0.2 });

    if (flippedCards.length === 2) {
      isChecking = true;
      checkMatch();
    }
  }

  /** Vérifie si les deux cartes correspondent */
  function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.dataset.cardId === card2.dataset.cardId) {
      // Match !
      matchedCount++;

      setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');

        // Animation de match
        gsap.fromTo([card1, card2], { scale: 1 }, {
          scale: 1.1,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        });

        // Toast memory match
        const intensity = Math.min(0.4 + matchedCount * 0.1, 1);
        showFlirtyToast(getFlirtyLine('memoryMatch', intensity));

        flippedCards = [];
        isChecking = false;

        // Vérifie si le jeu est terminé
        if (matchedCount === totalPairs) {
          gameComplete();
        }
      }, 400);
    } else {
      // Pas de match — retourner les cartes
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');

        // Petit shake
        gsap.fromTo([card1, card2],
          { x: -3 },
          { x: 3, duration: 0.08, repeat: 3, yoyo: true, onComplete: () => gsap.set([card1, card2], { x: 0 }) }
        );

        flippedCards = [];
        isChecking = false;
      }, 800);
    }
  }

  /** Jeu terminé */
  function gameComplete() {
    updateData('memoryCompleted', true);

    // Animation de victoire
    const rect = grid.getBoundingClientRect();
    confettiHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 40);

    // Affiche le message de succès
    setTimeout(() => {
      const successEl = createElement('p', 'screen-subtitle glow-text', { textContent: successMessage });
      screen.appendChild(successEl);

      gsap.fromTo(successEl, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' });

      const nextBtn = createElement('button', 'btn btn--large btn--gold', { textContent: 'Vers la surprise 🎁' });
      nextBtn.addEventListener('click', () => {
        confettiHearts(window.innerWidth / 2, window.innerHeight / 2, 25);
        setTimeout(() => router.next(), 500);
      });

      screen.appendChild(nextBtn);
      gsap.fromTo(nextBtn, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.3 });
    }, 800);
  }

  return screen;
}
