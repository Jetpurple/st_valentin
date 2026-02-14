/**
 * helpers.js — Fonctions utilitaires diverses
 */

import gsap from 'gsap';

/** Vérifie si prefers-reduced-motion est actif */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Crée un élément DOM avec classes et attributs */
export function createElement(tag, className = '', attrs = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'textContent') el.textContent = v;
    else if (k === 'innerHTML') el.innerHTML = v;
    else el.setAttribute(k, v);
  });
  return el;
}

/** Explosion de cœurs confettis */
export function confettiHearts(x, y, count = 30) {
  if (prefersReducedMotion()) count = 5;

  const hearts = ['❤️', '💖', '💕', '💗', '💘', '💝', '🩷', '✨'];
  const container = document.getElementById('app');

  for (let i = 0; i < count; i++) {
    const heart = document.createElement('span');
    heart.className = 'confetti-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${x}px`;
    heart.style.top = `${y}px`;
    heart.style.fontSize = `${Math.random() * 20 + 12}px`;
    container.appendChild(heart);

    const angle = (Math.random() * Math.PI * 2);
    const distance = Math.random() * 200 + 80;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 100;

    gsap.to(heart, {
      x: tx,
      y: ty,
      rotation: Math.random() * 720 - 360,
      opacity: 0,
      scale: Math.random() * 1.5 + 0.5,
      duration: Math.random() * 1.2 + 0.8,
      ease: 'power2.out',
      onComplete: () => heart.remove(),
    });
  }
}

/** Pluie de cœurs (plein écran) */
export function heartRain(duration = 5000) {
  if (prefersReducedMotion()) return;

  const container = document.getElementById('app');
  const hearts = ['❤️', '💖', '💕', '💗', '💘', '💝'];
  const interval = setInterval(() => {
    const heart = document.createElement('span');
    heart.className = 'rain-heart';
    heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.fontSize = `${Math.random() * 24 + 16}px`;
    container.appendChild(heart);

    gsap.fromTo(heart,
      { y: -50, opacity: 1, rotation: 0 },
      {
        y: window.innerHeight + 50,
        opacity: 0,
        rotation: Math.random() * 360,
        duration: Math.random() * 2 + 2,
        ease: 'power1.in',
        onComplete: () => heart.remove(),
      }
    );
  }, 80);

  setTimeout(() => clearInterval(interval), duration);
}

/** Typing effect (machine à écrire) */
export function typeWriter(element, text, speed = 40) {
  return new Promise((resolve) => {
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

/** Anime l'entrée d'un écran */
export function animateScreenIn(screen) {
  if (prefersReducedMotion()) {
    gsap.set(screen, { opacity: 1 });
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    gsap.fromTo(screen,
      { opacity: 0, y: 60, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.7,
        ease: 'back.out(1.2)',
        onComplete: resolve,
      }
    );
  });
}

/** Anime la sortie d'un écran */
export function animateScreenOut(screen) {
  if (prefersReducedMotion()) {
    gsap.set(screen, { opacity: 0 });
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    gsap.to(screen, {
      opacity: 0, y: -40, scale: 0.95,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: resolve,
    });
  });
}

/** Lazy load une image avec fallback emoji */
export function lazyLoadImage(src, fallbackEmoji = '💕', alt = '') {
  const wrapper = createElement('div', 'lazy-img-wrapper');

  // Placeholder pendant chargement
  wrapper.innerHTML = `<span class="fallback-emoji loading-pulse">${fallbackEmoji}</span>`;

  // Créer l'image dans le DOM directement pour que le lazy loading fonctionne
  const img = document.createElement('img');
  img.alt = alt;
  img.loading = 'lazy';
  img.style.opacity = '0';
  img.style.position = 'absolute';
  img.style.width = '100%';
  img.style.height = '100%';
  img.style.objectFit = 'cover';

  img.onload = () => {
    wrapper.innerHTML = '';
    img.style.position = '';
    wrapper.appendChild(img);
    gsap.fromTo(img, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.4 });
  };

  img.onerror = () => {
    img.remove();
    wrapper.innerHTML = `<span class="fallback-emoji">${fallbackEmoji}</span>`;
  };

  wrapper.appendChild(img);
  img.src = src;

  return wrapper;
}

/** Génère un nombre aléatoire entre min et max */
export function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

/** Shuffle un tableau (Fisher-Yates) */
export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
