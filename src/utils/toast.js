/**
 * toast.js — Système de Toast animé pour les phrases taquines
 * - Affichage GSAP avec entrée/sortie fluide
 * - Shake pour phrases agressives (rageMode)
 * - Glow rose + emoji automatique
 * - Disparition automatique après 2.5s
 * - File d'attente pour éviter les chevauchements
 */

import gsap from 'gsap';
import { isRageMode } from './getFlirtyLine.js';

// ━━━ Configuration ━━━
const TOAST_DURATION = 2500;       // Durée d'affichage en ms
const TOAST_ANIM_IN = 0.4;        // Durée animation entrée
const TOAST_ANIM_OUT = 0.3;       // Durée animation sortie
const EMOJI_SET = ['😏', '😈', '💖', '🔥', '💕', '😜', '🤭', '💘', '✨', '🥰'];
const RAGE_EMOJI_SET = ['😡', '🤬', '💀', '⚡', '🔥', '😤', '💢'];

let currentToast = null;
let toastTimeout = null;
let toastContainer = null;

/** Initialise le conteneur de toasts (appeler une fois au démarrage) */
function ensureContainer() {
  if (toastContainer && document.body.contains(toastContainer)) return toastContainer;

  toastContainer = document.createElement('div');
  toastContainer.id = 'flirty-toast-container';
  toastContainer.className = 'flirty-toast-container';
  document.body.appendChild(toastContainer);
  return toastContainer;
}

/**
 * Affiche un toast avec une phrase
 * @param {string} text - La phrase à afficher
 * @param {object} options - Options supplémentaires
 * @param {boolean} options.shake - Ajouter une animation shake
 * @param {boolean} options.rage - Mode rage (style différent)
 * @param {string} options.emoji - Emoji spécifique (sinon aléatoire)
 */
export function showFlirtyToast(text, options = {}) {
  if (!text) return;

  const container = ensureContainer();
  const rage = options.rage || isRageMode();
  const shake = options.shake || rage;

  // Si un toast existe déjà, le retirer immédiatement
  if (currentToast) {
    clearTimeout(toastTimeout);
    gsap.killTweensOf(currentToast);
    currentToast.remove();
    currentToast = null;
  }

  // Créer le toast
  const toast = document.createElement('div');
  toast.className = `flirty-toast${rage ? ' flirty-toast--rage' : ''}`;

  // Emoji aléatoire
  const emojiPool = rage ? RAGE_EMOJI_SET : EMOJI_SET;
  const emoji = options.emoji || emojiPool[Math.floor(Math.random() * emojiPool.length)];

  toast.innerHTML = `
    <span class="flirty-toast__emoji">${emoji}</span>
    <span class="flirty-toast__text">${text}</span>
  `;

  container.appendChild(toast);
  currentToast = toast;

  // ━━━ Animation d'entrée ━━━
  gsap.fromTo(toast,
    {
      opacity: 0,
      y: 30,
      scale: 0.85,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: TOAST_ANIM_IN,
      ease: 'back.out(1.7)',
      onComplete: () => {
        // Shake si nécessaire
        if (shake) {
          gsap.fromTo(toast,
            { x: -4 },
            {
              x: 4,
              duration: 0.06,
              repeat: 5,
              yoyo: true,
              ease: 'power2.inOut',
              onComplete: () => gsap.set(toast, { x: 0 }),
            }
          );
        }
      },
    }
  );

  // ━━━ Disparition automatique ━━━
  toastTimeout = setTimeout(() => {
    if (toast && toast.parentElement) {
      gsap.to(toast, {
        opacity: 0,
        y: -20,
        scale: 0.9,
        duration: TOAST_ANIM_OUT,
        ease: 'power2.in',
        onComplete: () => {
          toast.remove();
          if (currentToast === toast) currentToast = null;
        },
      });
    }
  }, TOAST_DURATION);
}

/** Force la fermeture du toast actuel */
export function dismissToast() {
  if (currentToast) {
    clearTimeout(toastTimeout);
    gsap.killTweensOf(currentToast);
    gsap.to(currentToast, {
      opacity: 0,
      scale: 0.8,
      duration: 0.2,
      onComplete: () => {
        if (currentToast) {
          currentToast.remove();
          currentToast = null;
        }
      },
    });
  }
}
