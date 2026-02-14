/**
 * Écran 3 — "Attrape les cœurs" (Version FX complète)
 * 4 features :
 *  1) Pop comic apparition (GSAP)
 *  2) Explosion particules au clic
 *  3) Mode jalousie si trop de garçons cliqués
 *  4) Chien qui traverse l'écran (événement rare)
 *
 * Decoys : garçons + chiens (GIFs avec fallback emoji)
 * Performance : max 6 decoys, max 10 items total, lazy loading
 */

import gsap from 'gsap';
import { CONTENT } from '../content.js';
import { router } from '../router.js';
import { createElement, confettiHearts, randomBetween, prefersReducedMotion } from '../utils/helpers.js';
import { getFlirtyLine } from '../utils/getFlirtyLine.js';
import { showFlirtyToast } from '../utils/toast.js';
import { comicPop } from '../utils/comicPop.js';
import { burstParticles } from '../utils/burstParticles.js';
import { catchHeartsAssets } from '../assets/catchHeartsAssets.js';
import { getSarcasmLine } from '../content/sarcasmDecoyLines.js';
import { jealousyLines } from '../content/jealousyLines.js';
import { runnerDogLines } from '../content/runnerDogLines.js';

// ━━━ Constantes ━━━
const MAX_DECOYS_ACTIVE = 8;
const MAX_ITEMS_TOTAL = 12;
const JEALOUSY_THRESHOLD = 2;
const JEALOUSY_DURATION = 6000; // 6 secondes
const RUNNER_DOG_MIN_INTERVAL = 5000;
const RUNNER_DOG_MAX_INTERVAL = 10000;
const RUNNER_DOG_CHANCE = 0.35;
const DOG_CLICK_THRESHOLD = 2; // chiens cliqués pour forcer runner dog
const DECOY_PROBABILITY_DEFAULT = 0.38; // 38% de chance decoy au lieu de cœur
const BOY_PROBABILITY_DEFAULT = 0.30; // 30% de boys dans les decoys totaux
const BOY_PROBABILITY_JEALOUSY = 0.12; // 12% de boys pendant jalousie
const SCORE_HEART = 1;
const SCORE_DECOY_PENALTY = -3;
const SCORE_RUNNER_DOG_BONUS = 2;

export function createCatchHeartsScreen() {
  const { title, instructions, goal, timeLimit, successMessage, failMessage, heartEmojis } = CONTENT.catchHearts;

  const screen = createElement('div', 'screen catch-screen');

  // Titre
  const titleEl = createElement('h2', 'screen-title', { textContent: title });

  // Instructions
  const instrEl = createElement('p', 'screen-subtitle', { textContent: instructions });

  // Header (timer + score)
  const header = createElement('div', 'catch-header');
  const timerEl = createElement('div', 'catch-timer', { textContent: `⏱ ${timeLimit}s` });
  const scoreEl = createElement('div', 'catch-score', { textContent: `💖 0/${goal}` });
  header.appendChild(timerEl);
  header.appendChild(scoreEl);

  // Zone de jeu
  const area = createElement('div', 'catch-area');

  // Bouton Start
  const startBtn = createElement('button', 'btn btn--large btn--pulse', { textContent: '🎮 Jouer !' });

  // Message résultat
  const resultEl = createElement('p', 'screen-subtitle');
  resultEl.style.display = 'none';

  area.appendChild(startBtn);

  screen.appendChild(titleEl);
  screen.appendChild(instrEl);
  screen.appendChild(header);
  screen.appendChild(area);
  screen.appendChild(resultEl);

  // ━━━ State ━━━
  let score = 0;
  let timeLeft = timeLimit;
  let gameInterval = null;
  let spawnInterval = null;
  let isPlaying = false;
  let activeItemsCount = 0;
  let activeDecoysCount = 0;
  let boyMisclickCount = 0;
  let dogClickCount = 0;
  let jealousyActive = false;
  let jealousyTimer = null;
  let runnerDogTimer = null;
  let runnerDogActive = false;
  let jealousyOverlay = null;
  let jealousyGifEl = null;

  /** Démarre le jeu */
  function startGame() {
    score = 0;
    timeLeft = timeLimit;
    isPlaying = true;
    activeItemsCount = 0;
    activeDecoysCount = 0;
    boyMisclickCount = 0;
    dogClickCount = 0;
    jealousyActive = false;
    runnerDogActive = false;
    // Retirer le bouton de la zone avant de vider (sinon il est détruit)
    if (startBtn.parentElement === area) {
      area.removeChild(startBtn);
    }
    startBtn.style.display = 'none';
    instrEl.style.display = 'none';
    resultEl.style.display = 'none';
    area.innerHTML = '';

    // Nettoyer les éventuels overlays
    cleanupJealousy();

    updateUI();

    // Toast de début
    showFlirtyToast(getFlirtyLine('catchHearts', 0.5));

    // Timer
    gameInterval = setInterval(() => {
      timeLeft--;
      updateUI();

      if (timeLeft <= 5) {
        timerEl.classList.add('urgent');
      }

      if (timeLeft <= 0) {
        endGame(false);
      }
    }, 1000);

    // Spawn items (cœurs + decoys)
    spawnItem();
    spawnInterval = setInterval(spawnItem, 650);

    // Programmer le runner dog
    scheduleRunnerDog();
  }

  /** ━━━ SPAWN ITEM ━━━ */
  function spawnItem() {
    if (!isPlaying) return;
    if (activeItemsCount >= MAX_ITEMS_TOTAL) return;

    // Décider : cœur ou decoy ?
    const isDecoy = Math.random() < DECOY_PROBABILITY_DEFAULT && activeDecoysCount < MAX_DECOYS_ACTIVE;

    if (isDecoy) {
      spawnDecoy();
    } else {
      spawnHeart();
    }
  }

  /** ━━━ SPAWN CŒUR ━━━ */
  function spawnHeart() {
    if (!isPlaying) return;
    if (activeItemsCount >= MAX_ITEMS_TOTAL) return;

    const heartEl = createElement('div', 'catch-item catch-item--heart');
    heartEl.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

    // Taille boostée en mode jealousy
    if (jealousyActive) {
      heartEl.classList.add('jealousy-boost');
    }

    positionInArea(heartEl);
    area.appendChild(heartEl);
    activeItemsCount++;

    // 1) Pop comic
    comicPop(heartEl, { glowColor: 'rgba(255, 45, 85, 0.6)' });

    // Disparaît après un délai
    const lifespan = randomBetween(2000, 3500);
    const fadeTimer = setTimeout(() => {
      removeItem(heartEl);
    }, lifespan);

    // Clic sur le cœur
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearTimeout(fadeTimer);

      score += SCORE_HEART;
      updateUI();

      // 2) Explosion particules love
      const rect = heartEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      burstParticles({ x: cx, y: cy, theme: 'love', count: 18 });

      // Score popup
      showScorePopup(cx, cy, `+${SCORE_HEART}`, 'bonus');

      // Animation de capture
      gsap.to(heartEl, {
        scale: 2,
        opacity: 0,
        y: -30,
        duration: 0.3,
        ease: 'power2.out',
        onComplete: () => {
          heartEl.remove();
          activeItemsCount = Math.max(0, activeItemsCount - 1);
        },
      });

      // Score flash
      gsap.fromTo(scoreEl, { scale: 1.2 }, { scale: 1, duration: 0.2 });

      // Toast toutes les 3 captures
      if (score % 3 === 0 && score < goal) {
        const intensity = Math.min(0.4 + score * 0.04, 1);
        showFlirtyToast(getFlirtyLine('catchHearts', intensity));
      }

      // Victoire
      if (score >= goal) {
        endGame(true);
      }
    };

    heartEl.addEventListener('click', handleClick);
    heartEl.addEventListener('touchstart', handleClick, { passive: false });
  }

  /** ━━━ SPAWN DECOY ━━━ */
  function spawnDecoy() {
    if (!isPlaying) return;
    if (activeDecoysCount >= MAX_DECOYS_ACTIVE) return;
    if (activeItemsCount >= MAX_ITEMS_TOTAL) return;

    // Déterminer le type de decoy
    const boyProb = jealousyActive ? BOY_PROBABILITY_JEALOUSY : BOY_PROBABILITY_DEFAULT;
    const isBoy = Math.random() < boyProb / DECOY_PROBABILITY_DEFAULT;
    const type = isBoy ? 'boy' : 'dog';

    const decoyEl = createElement('div', `catch-item catch-item--decoy decoy-${type}`);
    decoyEl.dataset.type = type;

    // Image ou fallback emoji
    const assets = isBoy ? catchHeartsAssets.decoys.boys : catchHeartsAssets.decoys.dogs;
    const fallback = isBoy ? catchHeartsAssets.fallback.boy : catchHeartsAssets.fallback.dog;
    const assetSrc = assets[Math.floor(Math.random() * assets.length)];

    const img = document.createElement('img');
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = isBoy ? 'Garçon' : 'Chien';
    img.src = assetSrc;

    img.onerror = () => {
      img.remove();
      const fb = createElement('div', 'decoy-fallback', { textContent: fallback });
      decoyEl.appendChild(fb);
    };

    decoyEl.appendChild(img);

    positionInArea(decoyEl);
    area.appendChild(decoyEl);
    activeItemsCount++;
    activeDecoysCount++;

    // 1) Pop comic (avec glow rouge/orange)
    const glowColor = isBoy ? 'rgba(239, 68, 68, 0.6)' : 'rgba(249, 115, 22, 0.6)';
    comicPop(decoyEl, { glowColor });

    // Disparaît après un délai
    const lifespan = randomBetween(2500, 4500);
    const fadeTimer = setTimeout(() => {
      removeDecoy(decoyEl);
    }, lifespan);

    // Clic sur le decoy
    const handleClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      clearTimeout(fadeTimer);

      // Pénalité
      score = Math.max(0, score + SCORE_DECOY_PENALTY);
      updateUI();

      // 2) Explosion particules error
      const rect = decoyEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      burstParticles({ x: cx, y: cy, theme: 'error', count: 22 });

      // Score popup négatif
      showScorePopup(cx, cy, `${SCORE_DECOY_PENALTY}`, 'negative');

      // Flash rouge
      flashRedOverlay();

      // Shake du container
      gsap.fromTo(area,
        { x: -5 },
        { x: 5, duration: 0.05, repeat: 5, yoyo: true, ease: 'power2.inOut', onComplete: () => gsap.set(area, { x: 0 }) }
      );

      // Toast sarcastique
      showFlirtyToast(getSarcasmLine(type), { rage: true, emoji: isBoy ? '🧍‍♂️' : '🐶' });

      // Tracker boys
      if (type === 'boy') {
        boyMisclickCount++;
        if (boyMisclickCount >= JEALOUSY_THRESHOLD && !jealousyActive) {
          triggerJealousy();
        }
      }

      // Tracker dogs
      if (type === 'dog') {
        dogClickCount++;
        if (dogClickCount >= DOG_CLICK_THRESHOLD && !runnerDogActive) {
          spawnRunnerDog();
        }
      }

      // Animation de disparition
      gsap.to(decoyEl, {
        scale: 0,
        opacity: 0,
        rotation: (Math.random() - 0.5) * 40,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          decoyEl.remove();
          activeItemsCount = Math.max(0, activeItemsCount - 1);
          activeDecoysCount = Math.max(0, activeDecoysCount - 1);
        },
      });

      // Score flash
      gsap.fromTo(scoreEl, { scale: 1.3, color: '#ef4444' }, { scale: 1, color: 'var(--white)', duration: 0.4 });
    };

    decoyEl.addEventListener('click', handleClick);
    decoyEl.addEventListener('touchstart', handleClick, { passive: false });
  }

  /** ━━━ 3) MODE JALOUSIE ━━━ */
  function triggerJealousy() {
    if (jealousyActive || !isPlaying) return;
    jealousyActive = true;

    // Choisir une phrase
    const line = jealousyLines[Math.floor(Math.random() * jealousyLines.length)];
    showFlirtyToast(line, { rage: true, emoji: '😈', shake: true });

    // Explosion particules jealousy au centre
    const areaRect = area.getBoundingClientRect();
    burstParticles({
      x: areaRect.left + areaRect.width / 2,
      y: areaRect.top + areaRect.height / 2,
      theme: 'jealousy',
      count: 30,
    });

    // Overlay violet
    jealousyOverlay = createElement('div', 'jealousy-overlay');
    document.body.appendChild(jealousyOverlay);
    gsap.fromTo(jealousyOverlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });

    // GIF jalousie (coin bas droite)
    jealousyGifEl = createElement('div', 'jealousy-gif-container');
    const jImg = document.createElement('img');
    jImg.src = catchHeartsAssets.special.jealousy;
    jImg.alt = 'Jalousie !';
    jImg.loading = 'lazy';
    jImg.decoding = 'async';
    jImg.onerror = () => {
      jImg.remove();
      const fb = createElement('div', 'jealousy-fallback', { textContent: catchHeartsAssets.fallback.jealousy });
      jealousyGifEl.appendChild(fb);
    };
    jealousyGifEl.appendChild(jImg);
    document.body.appendChild(jealousyGifEl);

    comicPop(jealousyGifEl, {
      overshoot: 1.3,
      glowColor: 'rgba(124, 58, 237, 0.6)',
    });

    // Agrandir les cœurs existants
    area.querySelectorAll('.catch-item--heart').forEach(h => {
      h.classList.add('jealousy-boost');
      gsap.to(h, { scale: 1.25, duration: 0.3, ease: 'back.out(2)' });
    });

    // Fin du mode jalousie après JEALOUSY_DURATION
    jealousyTimer = setTimeout(() => {
      cleanupJealousy();
    }, JEALOUSY_DURATION);
  }

  function cleanupJealousy() {
    jealousyActive = false;
    if (jealousyTimer) {
      clearTimeout(jealousyTimer);
      jealousyTimer = null;
    }
    if (jealousyOverlay) {
      gsap.to(jealousyOverlay, {
        opacity: 0, duration: 0.4,
        onComplete: () => { jealousyOverlay?.remove(); jealousyOverlay = null; },
      });
    }
    if (jealousyGifEl) {
      gsap.to(jealousyGifEl, {
        opacity: 0, scale: 0, duration: 0.3,
        onComplete: () => { jealousyGifEl?.remove(); jealousyGifEl = null; },
      });
    }
    // Retirer le boost des cœurs
    area.querySelectorAll('.jealousy-boost').forEach(h => {
      h.classList.remove('jealousy-boost');
    });
  }

  /** ━━━ 4) RUNNER DOG ━━━ */
  function scheduleRunnerDog() {
    if (!isPlaying) return;

    const delay = randomBetween(RUNNER_DOG_MIN_INTERVAL, RUNNER_DOG_MAX_INTERVAL);
    runnerDogTimer = setTimeout(() => {
      if (!isPlaying) return;

      // 20% de chance
      if (Math.random() < RUNNER_DOG_CHANCE) {
        spawnRunnerDog();
      }

      // Reprogrammer
      scheduleRunnerDog();
    }, delay);
  }

  function spawnRunnerDog() {
    if (runnerDogActive || !isPlaying) return;
    runnerDogActive = true;

    const dogEl = createElement('div', 'runner-dog');

    // Image ou fallback
    const img = document.createElement('img');
    img.src = catchHeartsAssets.special.runnerDog;
    img.alt = 'Chien qui court !';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = () => {
      img.remove();
      const fb = createElement('div', 'dog-fallback', { textContent: catchHeartsAssets.fallback.runnerDog });
      dogEl.appendChild(fb);
    };
    dogEl.appendChild(img);

    // Direction aléatoire
    const goRight = Math.random() > 0.5;
    const startX = goRight ? -100 : window.innerWidth + 100;
    const endX = goRight ? window.innerWidth + 100 : -100;

    dogEl.style.left = `${startX}px`;

    // Flip si va à gauche
    if (!goRight) {
      dogEl.style.transform = 'scaleX(-1)';
    }

    document.body.appendChild(dogEl);

    // Pop comic
    comicPop(dogEl, {
      duration: 0.3,
      ring: false,
      sparks: false,
    });

    let clicked = false;

    // Animation GSAP : traversée + léger bounce vertical
    const duration = randomBetween(2.5, 4);
    const tl = gsap.timeline({
      onComplete: () => {
        if (!clicked) {
          dogEl.remove();
          runnerDogActive = false;
        }
      },
    });

    tl.to(dogEl, {
      left: endX,
      duration: duration,
      ease: 'none',
    });

    // Bounce vertical simultané
    gsap.to(dogEl, {
      y: -15,
      duration: 0.3,
      repeat: Math.floor(duration / 0.6),
      yoyo: true,
      ease: 'power1.inOut',
    });

    // Motion blur optionnel
    if (!prefersReducedMotion()) {
      dogEl.classList.add('runner-dog--blur');
    }

    // Clic sur le runner dog
    const handleDogClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (clicked) return;
      clicked = true;

      // Bonus
      score += SCORE_RUNNER_DOG_BONUS;
      updateUI();

      tl.kill();
      gsap.killTweensOf(dogEl);

      // Particules love
      const rect = dogEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      burstParticles({ x: cx, y: cy, theme: 'love', count: 24 });

      // Score popup bonus
      showScorePopup(cx, cy, `+${SCORE_RUNNER_DOG_BONUS}`, 'bonus');

      // Phrase drôle
      const line = runnerDogLines[Math.floor(Math.random() * runnerDogLines.length)];
      showFlirtyToast(line, { emoji: '🐕' });

      // Animation de capture
      gsap.to(dogEl, {
        scale: 1.5,
        opacity: 0,
        y: -40,
        duration: 0.4,
        ease: 'back.out(2)',
        onComplete: () => {
          dogEl.remove();
          runnerDogActive = false;
        },
      });

      // Victoire check
      if (score >= goal) {
        endGame(true);
      }
    };

    dogEl.addEventListener('click', handleDogClick);
    dogEl.addEventListener('touchstart', handleDogClick, { passive: false });
  }

  /** ━━━ HELPERS ━━━ */

  /** Positionne un élément aléatoirement dans la zone de jeu */
  function positionInArea(el) {
    const areaRect = area.getBoundingClientRect();
    const maxX = areaRect.width - 70;
    const maxY = areaRect.height - 70;
    const x = randomBetween(10, Math.max(10, maxX));
    const y = randomBetween(10, Math.max(10, maxY));
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
  }

  /** Retire un item avec animation */
  function removeItem(el) {
    if (!el.parentElement) return;
    gsap.to(el, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        el.remove();
        activeItemsCount = Math.max(0, activeItemsCount - 1);
      },
    });
  }

  /** Retire un decoy avec animation */
  function removeDecoy(el) {
    if (!el.parentElement) return;
    gsap.to(el, {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        el.remove();
        activeItemsCount = Math.max(0, activeItemsCount - 1);
        activeDecoysCount = Math.max(0, activeDecoysCount - 1);
      },
    });
  }

  /** Flash rouge au clic decoy */
  function flashRedOverlay() {
    const flash = createElement('div', 'catch-decoy-flash');
    document.body.appendChild(flash);
    gsap.fromTo(flash,
      { opacity: 1 },
      { opacity: 0, duration: 0.35, ease: 'power2.out', onComplete: () => flash.remove() }
    );
  }

  /** Popup de score (+1, -3, +2) */
  function showScorePopup(x, y, text, type = '') {
    const popup = createElement('div', `score-popup${type ? ` score-popup--${type}` : ''}`);
    popup.textContent = text;
    popup.style.left = `${x}px`;
    popup.style.top = `${y}px`;
    document.body.appendChild(popup);

    gsap.fromTo(popup,
      { opacity: 1, y: 0, scale: 1 },
      {
        opacity: 0,
        y: -50,
        scale: 1.3,
        duration: 0.8,
        ease: 'power2.out',
        onComplete: () => popup.remove(),
      }
    );
  }

  /** Met à jour l'affichage */
  function updateUI() {
    timerEl.textContent = `⏱ ${timeLeft}s`;
    scoreEl.textContent = `💖 ${score}/${goal}`;
  }

  /** Fin du jeu */
  function endGame(won) {
    isPlaying = false;
    clearInterval(gameInterval);
    clearInterval(spawnInterval);
    clearTimeout(runnerDogTimer);

    // Nettoyer la jalousie
    cleanupJealousy();

    // Nettoyer les items restants
    gsap.to(area.querySelectorAll('.catch-item'), {
      scale: 0, opacity: 0, duration: 0.3, stagger: 0.05,
    });

    // Nettoyer le runner dog éventuel
    document.querySelectorAll('.runner-dog').forEach(d => {
      gsap.killTweensOf(d);
      d.remove();
    });
    runnerDogActive = false;

    timerEl.classList.remove('urgent');

    if (won) {
      resultEl.textContent = successMessage;
      resultEl.style.display = 'block';
      gsap.fromTo(resultEl, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)' });

      // Confettis
      const rect = area.getBoundingClientRect();
      confettiHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 35);

      // Explosion de particules love finale
      burstParticles({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        theme: 'love',
        count: 40,
      });

      // Transition
      setTimeout(() => router.next(), 2500);
    } else {
      resultEl.textContent = failMessage;
      resultEl.style.display = 'block';
      gsap.fromTo(resultEl, { opacity: 0 }, { opacity: 1, duration: 0.5 });

      // Bouton réessayer (remettre dans la zone de jeu)
      startBtn.textContent = '🔄 Réessayer';
      startBtn.style.display = '';
      area.appendChild(startBtn);
      gsap.fromTo(startBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4, delay: 0.5 });
    }
  }

  // Événement start
  startBtn.addEventListener('click', startGame);

  return screen;
}
