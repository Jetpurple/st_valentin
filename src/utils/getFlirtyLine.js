/**
 * getFlirtyLine.js — Sélecteur intelligent de phrases taquines
 * - Mode vulgar on/off avec fallback soft
 * - Anti-répétition immédiate
 * - Intensité variable
 * - Compteur d'esquives pour rageMode
 * - Phrase RARE aléatoire
 */

import { flirtyLinesVulgar, flirtyLinesSoft, RARE_LINE, RARE_CHANCE } from '../content/flirtyLinesVulgar.js';

// ━━━ État interne ━━━
const state = {
  modeVulgar: true,        // true = phrases taquines, false = soft
  lastShown: {},            // { category: lastIndex } pour anti-répétition
  dodgeCount: 0,            // compteur d'esquives du bouton NON
  rageActive: false,        // rageMode actif temporairement
  rageThreshold: 15,        // seuil pour activer le rageMode
  rageDuration: 10000,      // durée du rageMode en ms (10s)
  rageTimer: null,
};

/**
 * Récupère une phrase aléatoire pour une catégorie donnée
 * @param {string} category - Clé de catégorie (welcome, dodgeNo, yesGrow, etc.)
 * @param {number} intensity - 0 à 1, influence la probabilité de phrases plus osées (défaut: 0.5)
 * @returns {string} La phrase sélectionnée
 */
export function getFlirtyLine(category, intensity = 0.5) {
  // Vérifier la phrase RARE (2.5% de chance)
  if (Math.random() < RARE_CHANCE) {
    return RARE_LINE;
  }

  // Sélectionner la bonne liste
  const pool = getPool(category, intensity);
  if (!pool || pool.length === 0) return '';

  // Anti-répétition : éviter la dernière phrase montrée dans cette catégorie
  const lastIndex = state.lastShown[category] ?? -1;
  let index;
  let attempts = 0;

  do {
    index = Math.floor(Math.random() * pool.length);
    attempts++;
  } while (index === lastIndex && pool.length > 1 && attempts < 10);

  state.lastShown[category] = index;
  return pool[index];
}

/**
 * Sélectionne le pool de phrases en fonction du mode et de l'intensité
 */
function getPool(category, intensity) {
  // Si rageMode actif et qu'on est sur dodgeNo → forcer rageMode
  if (state.rageActive && (category === 'dodgeNo' || category === 'yesGrow')) {
    const ragePool = state.modeVulgar
      ? flirtyLinesVulgar.rageMode
      : flirtyLinesSoft.rageMode;
    return ragePool || [];
  }

  if (!state.modeVulgar) {
    return flirtyLinesSoft[category] || [];
  }

  // Mode vulgar : l'intensité détermine si on mélange avec les soft
  // intensity 0 = 100% soft, intensity 1 = 100% vulgar
  if (intensity < 0.3) {
    // Faible intensité : priorité soft avec quelques vulgar
    const soft = flirtyLinesSoft[category] || [];
    const vulgar = flirtyLinesVulgar[category] || [];
    return [...soft, ...vulgar.slice(0, Math.ceil(vulgar.length * 0.3))];
  }

  if (intensity < 0.7) {
    // Intensité moyenne : mélange des deux
    const soft = flirtyLinesSoft[category] || [];
    const vulgar = flirtyLinesVulgar[category] || [];
    return [...soft, ...vulgar];
  }

  // Haute intensité : 100% vulgar
  return flirtyLinesVulgar[category] || [];
}

// ━━━ Gestion du mode ━━━

/** Active/désactive le mode vulgaire */
export function setModeVulgar(enabled) {
  state.modeVulgar = enabled;
}

/** Retourne l'état actuel du mode */
export function isModeVulgar() {
  return state.modeVulgar;
}

/** Toggle le mode vulgar */
export function toggleModeVulgar() {
  state.modeVulgar = !state.modeVulgar;
  return state.modeVulgar;
}

// ━━━ Gestion du rageMode ━━━

/**
 * Incrémente le compteur d'esquives du NON
 * Si le seuil est atteint, active le rageMode temporairement
 * @returns {boolean} true si le rageMode vient d'être activé
 */
export function incrementDodgeCount() {
  state.dodgeCount++;

  if (state.dodgeCount >= state.rageThreshold && !state.rageActive) {
    activateRageMode();
    return true;
  }

  return false;
}

/** Réinitialise le compteur d'esquives */
export function resetDodgeCount() {
  state.dodgeCount = 0;
  state.rageActive = false;
  if (state.rageTimer) {
    clearTimeout(state.rageTimer);
    state.rageTimer = null;
  }
}

/** Active le rageMode temporairement */
function activateRageMode() {
  state.rageActive = true;

  // Désactiver après la durée définie
  state.rageTimer = setTimeout(() => {
    state.rageActive = false;
    state.dodgeCount = 0; // Reset le compteur aussi
  }, state.rageDuration);
}

/** Vérifie si le rageMode est actif */
export function isRageMode() {
  return state.rageActive;
}

/** Retourne le compteur d'esquives actuel */
export function getDodgeCount() {
  return state.dodgeCount;
}
