/**
 * comicPop.js — Animation "pop comic" pour apparition d'éléments
 * Style manga/BD : overshoot, impact ring, spark lines
 */

import gsap from 'gsap';
import { prefersReducedMotion } from './helpers.js';

/**
 * Anime un élément avec un effet "pop comic"
 * @param {HTMLElement} el - L'élément à animer
 * @param {object} opts - Options
 * @param {number} opts.duration - Durée totale (défaut 0.5)
 * @param {number} opts.overshoot - Scale max avant settle (défaut 1.15)
 * @param {boolean} opts.ring - Afficher l'impact ring (défaut true)
 * @param {boolean} opts.sparks - Afficher les spark lines (défaut true)
 * @param {string} opts.glowColor - Couleur du glow (défaut 'rgba(255,45,85,0.6)')
 */
export function comicPop(el, opts = {}) {
  const {
    duration = 0.5,
    overshoot = 1.15,
    ring = true,
    sparks = true,
    glowColor = 'rgba(255, 45, 85, 0.6)',
  } = opts;

  // Reduced motion : juste un fade-in rapide
  if (prefersReducedMotion()) {
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.15 });
    return;
  }

  const randomRotation = (Math.random() - 0.5) * 24; // -12° à +12°

  // Timeline principale
  const tl = gsap.timeline();

  tl.fromTo(el,
    {
      scale: 0.2,
      rotation: randomRotation,
      opacity: 0,
      filter: 'blur(4px)',
    },
    {
      scale: overshoot,
      rotation: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: duration * 0.6,
      ease: 'back.out(3)',
    }
  )
  .to(el, {
    scale: 1,
    duration: duration * 0.4,
    ease: 'elastic.out(1.2, 0.5)',
  });

  // Impact ring
  if (ring) {
    createImpactRing(el, glowColor, duration);
  }

  // Spark lines
  if (sparks) {
    createSparkLines(el, duration);
  }

  return tl;
}

/**
 * Crée un anneau d'impact autour de l'élément
 */
function createImpactRing(el, color, duration) {
  const ringEl = document.createElement('div');
  ringEl.className = 'comic-impact-ring';
  ringEl.style.setProperty('--ring-color', color);

  // S'assurer que l'élément est un contexte de positionnement (sans écraser absolute/fixed)
  const computed = window.getComputedStyle(el).position;
  if (computed === 'static') {
    el.style.position = 'relative';
  }
  el.appendChild(ringEl);

  gsap.fromTo(ringEl,
    { scale: 0.3, opacity: 1 },
    {
      scale: 2.5,
      opacity: 0,
      duration: duration * 1.2,
      ease: 'power2.out',
      onComplete: () => ringEl.remove(),
    }
  );
}

/**
 * Crée des lignes d'étincelles (spark lines)
 */
function createSparkLines(el, duration) {
  const count = 3 + Math.floor(Math.random() * 2); // 3-4 sparks

  for (let i = 0; i < count; i++) {
    const spark = document.createElement('div');
    spark.className = 'comic-spark-line';

    const angle = (i / count) * 360 + (Math.random() - 0.5) * 40;
    spark.style.setProperty('--spark-angle', `${angle}deg`);

    el.appendChild(spark);

    gsap.fromTo(spark,
      { scaleX: 0, opacity: 1 },
      {
        scaleX: 1,
        opacity: 0,
        duration: duration * 0.8,
        delay: duration * 0.1,
        ease: 'power3.out',
        onComplete: () => spark.remove(),
      }
    );
  }
}
