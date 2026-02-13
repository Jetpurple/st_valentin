/**
 * Écran 2 — "Veux-tu être ma Valentine ?"
 * Le bouton NON fuit, le bouton OUI grandit
 */

import gsap from 'gsap';
import { CONTENT } from '../content.js';
import { router } from '../router.js';
import { createElement, confettiHearts } from '../utils/helpers.js';
import { getFlirtyLine, incrementDodgeCount, resetDodgeCount, isRageMode } from '../utils/getFlirtyLine.js';
import { showFlirtyToast } from '../utils/toast.js';

export function createValentineScreen() {
  const { question, yesText, noText, escapeMessages, successMessage } = CONTENT.valentine;

  const screen = createElement('div', 'screen valentine-screen');

  // Emoji
  const emoji = createElement('div', 'screen-emoji float-anim', { textContent: '🥺' });

  // Question
  const questionEl = createElement('h2', 'screen-title', { textContent: question });

  // Message fun
  const messageEl = createElement('p', 'valentine-message');

  // Zone boutons
  const buttonsDiv = createElement('div', 'valentine-buttons');

  // Bouton OUI
  const yesBtn = createElement('button', 'btn btn--large btn--success btn-yes', { textContent: yesText });
  let yesScale = 1;

  // Bouton NON
  const noBtn = createElement('button', 'btn btn--outline btn-no', { textContent: noText });

  buttonsDiv.appendChild(yesBtn);

  screen.appendChild(emoji);
  screen.appendChild(questionEl);
  screen.appendChild(messageEl);
  screen.appendChild(buttonsDiv);

  // Le bouton NON est enfant direct du screen pour se déplacer partout
  screen.appendChild(noBtn);

  let escapeCount = 0;
  let lastEscapeTime = 0;

  // Reset le compteur de rage au démarrage de l'écran
  resetDodgeCount();

  // ━━━ ZONE D'ESQUIVE : le bouton disparaît après un bref survol (~100ms) ━━━
  const ESCAPE_COOLDOWN = 80;      // Cooldown entre 2 esquives en ms
  const HOVER_GRACE_MS = 100;      // Temps de survol avant disparition (~5% de la surface)

  let isVanishing = false;         // empêche les triggers pendant la disparition/réapparition
  let hoverTimer = null;           // timer de grâce au survol

  // On mémorise les dimensions réelles du bouton avant toute animation
  let cachedBtnW = 0;
  let cachedBtnH = 0;
  requestAnimationFrame(() => {
    cachedBtnW = noBtn.offsetWidth || 80;
    cachedBtnH = noBtn.offsetHeight || 48;
  });

  /** Téléporte le bouton instantanément à une position aléatoire */
  function teleportAway() {
    const now = Date.now();
    if (now - lastEscapeTime < ESCAPE_COOLDOWN) return;
    if (isVanishing) return;
    lastEscapeTime = now;
    isVanishing = true;

    // Annuler le hover timer au cas où
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }

    const btnW = cachedBtnW;
    const btnH = cachedBtnH;
    const margin = 20;
    const screenRect = screen.getBoundingClientRect();

    const randX = margin + Math.random() * Math.max(0, screenRect.width - btnW - margin * 2);
    const randY = margin + Math.random() * Math.max(0, screenRect.height - btnH - margin * 2);

    // Nettoyer right (conflit CSS) et téléporter directement
    noBtn.style.right = 'auto';
    gsap.killTweensOf(noBtn);
    gsap.set(noBtn, {
      left: randX,
      top: randY,
    });

    isVanishing = false;
  }

  /** Gère l'esquive + effets visuels */
  function triggerEscape() {
    teleportAway();

    // Limiter les messages/toasts (pas à chaque micro-mouvement)
    const prevCount = escapeCount;
    escapeCount++;

    // Message fun (original) — tous les 2 esquives
    if (escapeCount % 2 === 1) {
      const msg = escapeMessages[prevCount % escapeMessages.length];
      messageEl.textContent = msg;
      gsap.fromTo(messageEl, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });
    }

    // Le bouton OUI grandit — à chaque esquive
    yesScale += 0.06;
    gsap.to(yesBtn, {
      scale: Math.min(yesScale, 2.5),
      duration: 0.3,
      ease: 'back.out(2)',
    });

    // Changer l'emoji
    const emojis = ['🥺', '😜', '😏', '🤭', '😂', '💘', '🥰', '😇'];
    emoji.textContent = emojis[escapeCount % emojis.length];

    // ━━━ Toast taquin (pas à chaque esquive, sinon spam) ━━━
    if (escapeCount % 3 === 0) {
      const justActivatedRage = incrementDodgeCount();

      if (justActivatedRage) {
        showFlirtyToast(getFlirtyLine('rageMode', 1), { rage: true });
      } else if (isRageMode()) {
        showFlirtyToast(getFlirtyLine('rageMode', 1), { rage: true });
      } else {
        const intensity = Math.min(0.5 + escapeCount * 0.03, 1);
        if (escapeCount % 6 === 0) {
          showFlirtyToast(getFlirtyLine('yesGrow', intensity));
        } else {
          showFlirtyToast(getFlirtyLine('dodgeNo', intensity));
        }
      }
    } else {
      // Quand même compter pour le rage même sans toast
      incrementDodgeCount();
    }
  }

  // ━━━ DESKTOP : le curseur doit survoler le bouton ~100ms avant qu'il disparaisse ━━━
  noBtn.addEventListener('mouseenter', () => {
    hoverTimer = setTimeout(() => {
      triggerEscape();
    }, HOVER_GRACE_MS);
  });

  noBtn.addEventListener('mouseleave', () => {
    if (hoverTimer) {
      clearTimeout(hoverTimer);
      hoverTimer = null;
    }
  });

  // ━━━ CLIC SUR NON : disparaît → réapparaît ailleurs + OUI grandit ━━━
  function handleNoClick(e) {
    e.preventDefault();
    e.stopPropagation();

    // Disparaître et réapparaître aléatoirement
    teleportAway();

    // Compter l'esquive
    const prevCount = escapeCount;
    escapeCount++;

    // Grossir le OUI (davantage qu'une simple esquive)
    yesScale += 0.12;
    gsap.to(yesBtn, {
      scale: Math.min(yesScale, 2.5),
      duration: 0.4,
      ease: 'elastic.out(1, 0.5)',
    });

    // Message fun
    const msg = escapeMessages[prevCount % escapeMessages.length];
    messageEl.textContent = msg;
    gsap.fromTo(messageEl, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3 });

    // Emoji
    const emojis = ['🥺', '😜', '😏', '🤭', '😂', '💘', '🥰', '😇'];
    emoji.textContent = emojis[escapeCount % emojis.length];

    // Toast taquin
    incrementDodgeCount();
    const justActivatedRage = isRageMode();
    if (justActivatedRage) {
      showFlirtyToast(getFlirtyLine('rageMode', 1), { rage: true });
    } else {
      const intensity = Math.min(0.5 + escapeCount * 0.04, 1);
      showFlirtyToast(getFlirtyLine('dodgeNo', intensity), { shake: true });
    }
  }

  noBtn.addEventListener('click', handleNoClick);

  // ━━━ MOBILE : touchstart sur NON ━━━
  noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    triggerEscape();
  }, { passive: false });

  // Mobile : touchmove — si le doigt glisse sur le bouton, il disparaît
  screen.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    const rect = noBtn.getBoundingClientRect();
    const isOver = touch.clientX >= rect.left && touch.clientX <= rect.right
                && touch.clientY >= rect.top && touch.clientY <= rect.bottom;
    if (isOver) {
      triggerEscape();
    }
  }, { passive: true });

  // Clic sur OUI — Victoire !
  yesBtn.addEventListener('click', () => {
    emoji.textContent = '🎉';
    messageEl.textContent = successMessage;
    gsap.fromTo(messageEl, { scale: 0.5 }, { scale: 1, duration: 0.5, ease: 'back.out(2)' });

    // Toast yesClicked
    showFlirtyToast(getFlirtyLine('yesClicked', 0.9));

    // Confettis explosion
    const rect = yesBtn.getBoundingClientRect();
    confettiHearts(rect.left + rect.width / 2, rect.top, 40);

    // Transition après délai
    gsap.to(noBtn, { opacity: 0, scale: 0, duration: 0.3 });

    // Reset le compteur de rage
    resetDodgeCount();

    setTimeout(() => {
      router.next();
    }, 1500);
  });

  return screen;
}
