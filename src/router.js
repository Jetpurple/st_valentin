/**
 * router.js — Mini-router d'écrans
 * Gère la navigation entre les écrans avec transitions GSAP
 */

import { animateScreenIn, animateScreenOut } from './utils/helpers.js';

class Router {
  constructor() {
    this.screens = [];
    this.currentIndex = -1;
    this.container = null;
    this.isTransitioning = false;
    this.onScreenChange = null; // callback
  }

  /** Initialise le router */
  init(containerId = 'app') {
    this.container = document.getElementById(containerId);
  }

  /** Enregistre les écrans (fonctions qui retournent un élément DOM) */
  registerScreens(screens) {
    this.screens = screens;
  }

  /** Navigue vers un écran par index */
  async goTo(index) {
    if (index < 0 || index >= this.screens.length) return;
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // Anime la sortie de l'écran actuel
    const currentScreen = this.container.querySelector('.screen');
    if (currentScreen) {
      await animateScreenOut(currentScreen);
      currentScreen.remove();
    }

    // Crée et affiche le nouvel écran
    this.currentIndex = index;
    const screenFn = this.screens[index];
    const newScreen = await screenFn();

    if (newScreen) {
      this.container.appendChild(newScreen);
      await animateScreenIn(newScreen);
    }

    // Callback de changement
    if (this.onScreenChange) {
      this.onScreenChange(index, this.screens.length);
    }

    this.isTransitioning = false;
  }

  /** Écran suivant */
  async next() {
    if (this.currentIndex < this.screens.length - 1) {
      await this.goTo(this.currentIndex + 1);
    }
  }

  /** Écran précédent */
  async prev() {
    if (this.currentIndex > 0) {
      await this.goTo(this.currentIndex - 1);
    }
  }

  /** Retourne l'index actuel */
  getCurrent() {
    return this.currentIndex;
  }

  /** Retourne le nombre total d'écrans */
  getTotal() {
    return this.screens.length;
  }
}

// Singleton
export const router = new Router();
