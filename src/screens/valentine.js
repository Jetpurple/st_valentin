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
  buttonsDiv.appendChild(noBtn);

  screen.appendChild(emoji);
  screen.appendChild(questionEl);
  screen.appendChild(messageEl);
  screen.appendChild(buttonsDiv);

  let escapeCount = 0;
  let lastEscapeTime = 0;
  let hasEscaped = false;

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

  /** Déplace le bouton NON à une position proche, jamais sous OUI ni hors écran */
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

    const screenRect = screen.getBoundingClientRect();

    // Premier échappement : sortir du flow et passer en absolute
    if (!hasEscaped) {
      hasEscaped = true;
      const currentRect = noBtn.getBoundingClientRect();
      noBtn.classList.add('escaped');
      screen.appendChild(noBtn);
      // Placer à la position exacte qu'il avait en flow
      gsap.set(noBtn, {
        left: currentRect.left - screenRect.left,
        top: currentRect.top - screenRect.top,
      });
      // Mettre à jour les dimensions en cache
      cachedBtnW = noBtn.offsetWidth || 80;
      cachedBtnH = noBtn.offsetHeight || 48;
    }

    const btnW = cachedBtnW;
    const btnH = cachedBtnH;
    const margin = 12;
    const yesBtnRect = yesBtn.getBoundingClientRect();

    // Bornes relatives au screen
    const minX = margin;
    const maxX = Math.max(minX, screenRect.width - btnW - margin);
    const minY = margin;
    // Ne JAMAIS descendre en dessous du haut du bouton OUI
    const maxYBtn = yesBtnRect.top - screenRect.top;
    const maxYScreen = screenRect.height - btnH - margin;
    const maxY = Math.max(minY, Math.min(maxYBtn, maxYScreen));

    // Position actuelle
    const currentRect = noBtn.getBoundingClientRect();
    const currentX = currentRect.left - screenRect.left;
    const currentY = currentRect.top - screenRect.top;

    // Direction aléatoire + distance modérée (80–180px)
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 100;

    let newX = currentX + Math.cos(angle) * distance;
    let newY = currentY + Math.sin(angle) * distance;

    // Borner dans la zone autorisée
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    // Éviter de chevaucher le bouton OUI
    const yesRelLeft = yesBtnRect.left - screenRect.left;
    const yesRelRight = yesBtnRect.right - screenRect.left;
    const yesRelTop = yesBtnRect.top - screenRect.top;
    const yesRelBottom = yesBtnRect.bottom - screenRect.top;
    const overlapX = newX + btnW > yesRelLeft && newX < yesRelRight;
    const overlapY = newY + btnH > yesRelTop && newY < yesRelBottom;
    if (overlapX && overlapY) {
      // Décaler horizontalement hors du bouton OUI
      if (newX + btnW / 2 < yesRelLeft + (yesRelRight - yesRelLeft) / 2) {
        newX = Math.max(minX, yesRelLeft - btnW - margin);
      } else {
        newX = Math.min(maxX, yesRelRight + margin);
      }
    }

    noBtn.style.right = 'auto';
    gsap.killTweensOf(noBtn);
    gsap.to(noBtn, {
      left: newX,
      top: newY,
      duration: 0.25,
      ease: 'power2.out',
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
