/**
 * audio.js — Gestion de l'audio (musique d'ambiance + mute/unmute)
 */

import { ASSETS } from '../assets.js';

class AudioManager {
  constructor() {
    this.bgMusic = null;
    this.isMuted = true;
    this.isInitialized = false;
  }

  /** Initialise l'audio (doit être appelé après une interaction utilisateur) */
  init() {
    if (this.isInitialized) return;

    this.bgMusic = new Audio(ASSETS.audio.bgMusic);
    this.bgMusic.loop = true;
    this.bgMusic.volume = 0.3;

    // Fallback si le fichier n'existe pas
    this.bgMusic.addEventListener('error', () => {
      console.warn('🎵 Fichier audio non trouvé. Ajoutez un fichier MP3 dans /public/assets/audio/background.mp3');
    });

    this.isInitialized = true;
  }

  /** Active/désactive le son */
  toggle() {
    if (!this.isInitialized) this.init();

    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      this.bgMusic?.pause();
    } else {
      this.bgMusic?.play().catch(() => {
        console.warn('🎵 Impossible de lancer l\'audio automatiquement');
      });
    }

    return this.isMuted;
  }

  /** Force l'activation */
  play() {
    if (!this.isInitialized) this.init();
    this.isMuted = false;
    this.bgMusic?.play().catch(() => {});
  }

  /** Force la pause */
  pause() {
    this.isMuted = true;
    this.bgMusic?.pause();
  }

  /** Met à jour l'icône du bouton son */
  updateButton(btn) {
    if (btn) {
      btn.textContent = this.isMuted ? '🔇' : '🔊';
      btn.setAttribute('aria-label', this.isMuted ? 'Activer le son' : 'Couper le son');
    }
  }
}

// Singleton
export const audioManager = new AudioManager();
