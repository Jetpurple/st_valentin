/**
 * Écran 4 — Quiz couple
 * Questions à choix multiples avec animations
 */

import gsap from 'gsap';
import { CONTENT } from '../content.js';
import { router } from '../router.js';
import { updateData } from '../utils/storage.js';
import { createElement, confettiHearts } from '../utils/helpers.js';
import { getFlirtyLine } from '../utils/getFlirtyLine.js';
import { showFlirtyToast } from '../utils/toast.js';

export function createQuizScreen() {
  const { title, questions } = CONTENT.quiz;

  const screen = createElement('div', 'screen quiz-screen');

  let currentQ = 0;
  let totalScore = 0;

  // Titre
  const titleEl = createElement('h2', 'screen-title', { textContent: title });

  // Compteur
  const counterEl = createElement('p', 'quiz-counter');

  // Question
  const questionEl = createElement('p', 'quiz-question');

  // Options
  const optionsDiv = createElement('div', 'quiz-options');

  screen.appendChild(titleEl);
  screen.appendChild(counterEl);
  screen.appendChild(questionEl);
  screen.appendChild(optionsDiv);

  /** Affiche une question */
  function showQuestion(index) {
    const q = questions[index];
    counterEl.textContent = `Question ${index + 1}/${questions.length}`;
    questionEl.textContent = q.question;
    // Anime le texte
    gsap.fromTo(questionEl, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.4 });

    // Crée les boutons d'options
    optionsDiv.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = createElement('button', 'quiz-option', { textContent: opt });

      btn.addEventListener('click', () => handleAnswer(i, btn));

      // Animation d'apparition décalée
      btn.style.opacity = '0';
      btn.style.transform = 'translateX(-20px)';
      gsap.to(btn, {
        opacity: 1,
        x: 0,
        duration: 0.3,
        delay: i * 0.1,
        ease: 'power2.out',
      });

      optionsDiv.appendChild(btn);
    });
  }

  /** Gère la réponse */
  function handleAnswer(selectedIndex, btn) {
    const q = questions[currentQ];
    const allBtns = optionsDiv.querySelectorAll('.quiz-option');

    // Désactiver tous les boutons
    allBtns.forEach(b => b.style.pointerEvents = 'none');

    if (selectedIndex === q.correct) {
      // Bonne réponse !
      btn.classList.add('correct');
      totalScore++;

      gsap.fromTo(btn, { scale: 1 }, { scale: 1.05, duration: 0.2, yoyo: true, repeat: 1 });
      btn.classList.add('glow-success');

      // Confettis
      const rect = btn.getBoundingClientRect();
      confettiHearts(rect.left + rect.width / 2, rect.top, 15);

      // Toast bonne réponse
      showFlirtyToast(getFlirtyLine('quizCorrect', 0.8));

      // Question suivante après délai
      setTimeout(() => {
        nextQuestion();
      }, 1200);
    } else {
      // Mauvaise réponse
      btn.classList.add('wrong', 'shake');

      // Toast mauvaise réponse
      showFlirtyToast(getFlirtyLine('quizWrong', 0.7), { shake: true });

      // Réactiver les boutons (sauf celui sélectionné) pour réessayer
      setTimeout(() => {
        btn.classList.remove('shake');
        allBtns.forEach(b => {
          if (!b.classList.contains('wrong')) {
            b.style.pointerEvents = 'auto';
          }
        });
      }, 600);
    }
  }

  /** Passe à la question suivante */
  function nextQuestion() {
    currentQ++;

    if (currentQ >= questions.length) {
      // Quiz terminé !
      updateData('quizScore', totalScore);
      showResult();
    } else {
      showQuestion(currentQ);
    }
  }

  /** Affiche le résultat final du quiz */
  function showResult() {
    screen.innerHTML = '';

    const resultEmoji = totalScore === questions.length ? '🏆' : '⭐';
    const emojiEl = createElement('div', 'screen-emoji bounce-in', { textContent: resultEmoji });

    const resultTitle = createElement('h2', 'screen-title', {
      textContent: `${totalScore}/${questions.length} bonnes réponses !`,
    });

    const resultMsg = createElement('p', 'screen-subtitle', {
      textContent: totalScore === questions.length
        ? 'Tu me connais par cœur ! 💖'
        : 'Pas mal ! On va s\'améliorer ensemble 🥰',
    });

    const nextBtn = createElement('button', 'btn btn--large btn--pulse', {
      textContent: 'Continuer ➡️',
    });

    nextBtn.addEventListener('click', () => {
      const rect = nextBtn.getBoundingClientRect();
      confettiHearts(rect.left + rect.width / 2, rect.top, 20);
      setTimeout(() => router.next(), 500);
    });

    screen.appendChild(emojiEl);
    screen.appendChild(resultTitle);
    screen.appendChild(resultMsg);
    screen.appendChild(nextBtn);

    gsap.fromTo(screen.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.15 });
  }

  // Premier affichage
  requestAnimationFrame(() => showQuestion(0));

  return screen;
}
