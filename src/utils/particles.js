/**
 * particles.js — Particules cœurs animées en fond (canvas)
 */

class ParticleSystem {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationId = null;
    this.isRunning = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /** Initialise le canvas et lance les particules */
  init(canvasId = 'particles-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();

    // Écoute le resize
    window.addEventListener('resize', () => this.resize());

    // Parallax souris (desktop)
    window.addEventListener('mousemove', (e) => {
      this.mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
      this.mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
    });

    // Tilt (mobile)
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null) {
        this.mouseX = (e.gamma / 45) * 20;
        this.mouseY = (e.beta / 45) * 20;
      }
    });

    // Créer les particules initiales
    this.createParticles();

    // Démarrer l'animation
    if (!this.reducedMotion) {
      this.start();
    }
  }

  /** Redimensionne le canvas */
  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /** Crée les particules cœurs */
  createParticles() {
    const count = this.reducedMotion ? 8 : Math.min(35, Math.floor(window.innerWidth / 40));
    this.particles = [];

    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle());
    }
  }

  /** Crée une particule unique */
  createParticle() {
    return {
      x: Math.random() * (this.canvas?.width || window.innerWidth),
      y: Math.random() * (this.canvas?.height || window.innerHeight),
      size: Math.random() * 14 + 6,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: -(Math.random() * 0.8 + 0.2),
      opacity: Math.random() * 0.5 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      hue: Math.random() * 30 + 340, // rose-rouge
    };
  }

  /** Dessine un cœur */
  drawHeart(x, y, size, rotation, hue, opacity) {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 20, size / 20);
    ctx.globalAlpha = opacity;

    ctx.beginPath();
    ctx.moveTo(0, -5);
    ctx.bezierCurveTo(-10, -15, -20, -5, -10, 5);
    ctx.lineTo(0, 15);
    ctx.lineTo(10, 5);
    ctx.bezierCurveTo(20, -5, 10, -15, 0, -5);
    ctx.closePath();

    ctx.fillStyle = `hsla(${hue}, 80%, 65%, ${opacity})`;
    ctx.fill();
    ctx.restore();
  }

  /** Boucle d'animation */
  animate() {
    if (!this.isRunning || !this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const p of this.particles) {
      // Mouvement + parallax
      p.x += p.speedX + this.mouseX * 0.02;
      p.y += p.speedY + this.mouseY * 0.01;
      p.rotation += p.rotationSpeed;

      // Rebouclage
      if (p.y < -20) {
        p.y = this.canvas.height + 20;
        p.x = Math.random() * this.canvas.width;
      }
      if (p.x < -20) p.x = this.canvas.width + 20;
      if (p.x > this.canvas.width + 20) p.x = -20;

      this.drawHeart(p.x, p.y, p.size, p.rotation, p.hue, p.opacity);
    }

    this.animationId = requestAnimationFrame(() => this.animate());
  }

  /** Démarre l'animation */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  /** Stoppe l'animation */
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

export const particleSystem = new ParticleSystem();
