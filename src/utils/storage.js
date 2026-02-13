/**
 * storage.js — Gestion du localStorage (scores, progression)
 */

const STORAGE_KEY = 'st_valentin_data';

/** Récupère les données sauvegardées */
export function getData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : getDefaultData();
  } catch {
    return getDefaultData();
  }
}

/** Sauvegarde les données */
export function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    console.warn('localStorage non disponible');
  }
}

/** Met à jour un champ spécifique */
export function updateData(key, value) {
  const data = getData();
  data[key] = value;
  saveData(data);
  return data;
}

/** Données par défaut */
function getDefaultData() {
  return {
    currentScreen: 0,
    quizScore: 0,
    catchHeartsScore: 0,
    memoryCompleted: false,
    unlocked: false,
  };
}

/** Remet à zéro */
export function resetData() {
  saveData(getDefaultData());
}
