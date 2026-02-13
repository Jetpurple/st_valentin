/**
 * Écran 6 — Final "Cadeau"
 * Reveal progressif, galerie, code secret, déclaration d'amour
 */

import gsap from 'gsap';
import { CONTENT } from '../content.js';
import { ASSETS } from '../assets.js';
import { router } from '../router.js';
import { updateData, resetData } from '../utils/storage.js';
import { createElement, typeWriter, confettiHearts, heartRain, lazyLoadImage } from '../utils/helpers.js';
import { getFlirtyLine } from '../utils/getFlirtyLine.js';
import { showFlirtyToast } from '../utils/toast.js';

export function createFinalScreen() {
  const {
    revealMessage, unlockLabel, secretCode, codeHint,
    finalMessage, restartButton, galleryTitle,
  } = CONTENT.final;

  const screen = createElement('div', 'screen final-screen');

  // Phase 1: Message machine à écrire
  const messageEl = createElement('p', 'final-message typing-cursor');
  messageEl.style.opacity = '0';

  screen.appendChild(messageEl);

  requestAnimationFrame(async () => {
    gsap.set(messageEl, { opacity: 1 });
    await typeWriter(messageEl, revealMessage, 35);
    messageEl.classList.remove('typing-cursor');

    // Délai puis galerie
    await new Promise(r => setTimeout(r, 800));
    showGallery();
  });

  /** Phase 2: Galerie carousel */
  function showGallery() {
    const galleryTitleEl = createElement('h3', 'screen-subtitle', { textContent: galleryTitle });
    screen.appendChild(galleryTitleEl);

    const carousel = createElement('div', 'gallery-carousel');

    ASSETS.gallery.forEach((item, i) => {
      const slot = createElement('div', 'gallery-item');
      const imgWrapper = lazyLoadImage(item.src, ASSETS.fallbackEmojis[i] || '💕', item.alt);
      imgWrapper.style.width = '100%';
      imgWrapper.style.height = '100%';
      slot.appendChild(imgWrapper);
      carousel.appendChild(slot);
    });

    screen.appendChild(carousel);

    gsap.fromTo([galleryTitleEl, carousel],
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.2 }
    );

    // Délai puis code secret
    setTimeout(showCodeInput, 1000);
  }

  /** Phase 3: Code secret */
  function showCodeInput() {
    const wrapper = createElement('div', 'code-input-wrapper');

    const label = createElement('p', 'screen-subtitle', { textContent: unlockLabel });
    const codeDiv = createElement('div', 'code-input');

    const digits = [];
    for (let i = 0; i < secretCode.length; i++) {
      const input = createElement('input', 'code-digit', {
        type: 'tel',
        maxlength: '1',
        inputmode: 'numeric',
        'aria-label': `Chiffre ${i + 1}`,
      });

      input.addEventListener('input', (e) => {
        const val = e.target.value.replace(/\D/g, '');
        e.target.value = val;

        if (val && i < digits.length - 1) {
          digits[i + 1].focus();
        }

        checkCode();
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && i > 0) {
          digits[i - 1].focus();
        }
      });

      // Support paste
      input.addEventListener('paste', (e) => {
        e.preventDefault();
        const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, '');
        for (let j = 0; j < Math.min(paste.length, digits.length); j++) {
          digits[j].value = paste[j];
        }
        checkCode();
      });

      digits.push(input);
      codeDiv.appendChild(input);
    }

    const hintP = createElement('p', 'code-hint', { textContent: codeHint });

    wrapper.appendChild(label);
    wrapper.appendChild(codeDiv);
    wrapper.appendChild(hintP);
    screen.appendChild(wrapper);

    gsap.fromTo(wrapper, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });

    // Focus premier champ
    setTimeout(() => digits[0]?.focus(), 300);

    /** Vérifie le code */
    function checkCode() {
      const entered = digits.map(d => d.value).join('');
      if (entered.length === secretCode.length) {
        if (entered === secretCode) {
          // Code correct !
          digits.forEach(d => {
            d.classList.add('glow-success');
            d.disabled = true;
          });

          gsap.to(wrapper, {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
              setTimeout(() => showFinalReveal(), 600);
            },
          });
        } else {
          // Code incorrect — shake
          digits.forEach(d => d.classList.add('glow-error'));
          gsap.fromTo(codeDiv,
            { x: -5 },
            { x: 5, duration: 0.08, repeat: 5, yoyo: true, onComplete: () => gsap.set(codeDiv, { x: 0 }) }
          );

          setTimeout(() => {
            digits.forEach(d => {
              d.classList.remove('glow-error');
              d.value = '';
            });
            digits[0]?.focus();
          }, 600);
        }
      }
    }
  }

  /** Phase 4: Reveal final */
  function showFinalReveal() {
    updateData('unlocked', true);

    // Nettoyer l'écran
    gsap.to(screen.children, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      stagger: 0.05,
      onComplete: () => {
        screen.innerHTML = '';
        buildFinalReveal();
      },
    });
  }

  /** Construit le reveal final */
  function buildFinalReveal() {
    const reveal = createElement('div', 'final-reveal');

    // Toast final taquin
    showFlirtyToast(getFlirtyLine('finalReveal', 0.9));

    // Deuxième toast décalé
    setTimeout(() => {
      showFlirtyToast(getFlirtyLine('finalReveal', 1), { emoji: '💖' });
    }, 3500);

    // Grand texte I Love You
    const loveText = createElement('h1', 'final-love-text glow-text heartbeat', { textContent: finalMessage });

    // Emoji
    const emojiEl = createElement('div', 'screen-emoji', {
      textContent: '💖',
      innerHTML: '<span style="font-size:5rem">💖</span>',
    });

    // Bouton recommencer
    const restartBtn = createElement('button', 'btn btn--large btn--outline', { textContent: restartButton });
    restartBtn.addEventListener('click', () => {
      resetData();
      router.goTo(0);
    });

    reveal.appendChild(loveText);
    reveal.appendChild(emojiEl);
    reveal.appendChild(restartBtn);
    screen.appendChild(reveal);

    // Animations
    gsap.fromTo(loveText,
      { opacity: 0, scale: 0.3 },
      { opacity: 1, scale: 1, duration: 1, ease: 'elastic.out(1, 0.5)' }
    );

    gsap.fromTo(emojiEl,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, delay: 0.5 }
    );

    gsap.fromTo(restartBtn,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, delay: 1 }
    );

    // Pluie de cœurs
    heartRain(6000);

    // Confettis
    setTimeout(() => {
      confettiHearts(window.innerWidth / 2, window.innerHeight / 2, 50);
    }, 300);
  }

  return screen;
}
