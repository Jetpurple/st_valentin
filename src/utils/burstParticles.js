/**
 * burstParticles.js — Moteur de particules DOM + GSAP
 * Explosion au clic : thèmes love, error, jealousy
 * Pool limité à 120 particules actives max
 */

import gsap from 'gsap';
import { prefersReducedMotion } from './helpers.js';

// ━━━ Pool de particules ━━━
let activeParticleCount = 0;
const MAX_PARTICLES = 120;

// ━━━ Thèmes ━━━
const THEMES = {
  love: {
    shapes: ['❤️', '💖', '💕', '✨', '🩷'],
    colors: ['#ff2d55', '#ff6b8a', '#ff85a2', '#ffc0cb', '#ff1493'],
    useDots: true,
  },
  error: {
    shapes: ['✕', '✖', '💀', '⚡'],
    colors: ['#ef4444', '#f97316', '#dc2626', '#ea580c', '#b91c1c'],
    useDots: true,
  },
  jealousy: {
    shapes: ['😈', '⚡', '💢', '🔥', '👀'],
    colors: ['#7c3aed', '#a855f7', '#6d28d9', '#ef4444', '#f59e0b'],
    useDots: true,
  },
};

/**
 * Lance une explosion de particules
 * @param {object} opts
 * @param {number} opts.x - Position X (fixed)
 * @param {number} opts.y - Position Y (fixed)
 * @param {string} opts.theme - "love" | "error" | "jealousy"
 * @param {number} opts.count - Nombre de particules (défaut 18)
 */
export function burstParticles({ x, y, theme = 'love', count = 18 }) {
  if (prefersReducedMotion()) {
    count = Math.min(count, 4);
  }

  const themeData = THEMES[theme] || THEMES.love;

  // Limiter le total actif
  const available = MAX_PARTICLES - activeParticleCount;
  if (available <= 0) return;
  const actualCount = Math.min(count, available);

  // Conteneur (créé une seule fois)
  let container = document.getElementById('burst-particle-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'burst-particle-container';
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:hidden;';
    document.body.appendChild(container);
  }

  for (let i = 0; i < actualCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'burst-particle';

    // Alterner entre shape emoji et dot coloré
    const useDot = themeData.useDots && Math.random() > 0.5;

    if (useDot) {
      const color = themeData.colors[Math.floor(Math.random() * themeData.colors.length)];
      const size = Math.random() * 8 + 4;
      particle.style.cssText = `
        position:fixed;
        left:${x}px;
        top:${y}px;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        background:${color};
        pointer-events:none;
        will-change:transform,opacity;
        z-index:9998;
      `;
    } else {
      const shape = themeData.shapes[Math.floor(Math.random() * themeData.shapes.length)];
      const fontSize = Math.random() * 14 + 10;
      particle.style.cssText = `
        position:fixed;
        left:${x}px;
        top:${y}px;
        font-size:${fontSize}px;
        pointer-events:none;
        will-change:transform,opacity;
        z-index:9998;
        line-height:1;
      `;
      particle.textContent = shape;
    }

    container.appendChild(particle);
    activeParticleCount++;

    // Physique : direction + vélocité aléatoires
    const angle = (Math.random() * Math.PI * 2);
    const velocity = Math.random() * 160 + 60;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity - 80; // bias vers le haut
    const gravity = Math.random() * 100 + 60;
    const rotationEnd = (Math.random() - 0.5) * 720;
    const dur = Math.random() * 0.7 + 0.5;

    gsap.to(particle, {
      x: vx,
      y: vy + gravity, // simulate gravity pull
      rotation: rotationEnd,
      opacity: 0,
      scale: Math.random() * 0.5 + 0.3,
      duration: dur,
      ease: 'power2.out',
      onComplete: () => {
        particle.remove();
        activeParticleCount = Math.max(0, activeParticleCount - 1);
      },
    });
  }
}

/**
 * Retourne le nombre de particules actives (debug)
 */
export function getActiveParticleCount() {
  return activeParticleCount;
}
