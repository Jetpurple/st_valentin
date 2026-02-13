/**
 * content.js — Toutes les strings personnalisables du site
 * Modifie ce fichier pour adapter le contenu à ta moitié 💕
 */

export const CONTENT = {
  // Écran 1 — Accueil
  welcome: {
    title: "Femme 💖",
    subtitle: "J'ai préparé quelque chose de spécial pour toi...",
    startButton: "Commencer l'aventure 💕",
    soundButton: "🔊 Activer le son",
  },

  // Écran 2 — Valentine
  valentine: {
    question: "Veux-tu être ma Valentine ? 🥺",
    yesText: "OUI 💖",
    noText: "Non...",
    escapeMessages: [
      "Haha, essaie encore ! 😜",
      "Tu ne peux pas m'échapper ! 💘",
      "Même le bouton dit non à ton non ! 😂",
      "C'est pas la bonne réponse ça ! 🙈",
      "Réfléchis bien... 💭",
      "Le destin a parlé, c'est OUI ! ✨",
      "Ce bouton est timide, il fuit ! 🏃‍♂️",
      "Allez, dis OUI ! 🥰",
    ],
    successMessage: "Je le savais ! 🎉💖",
  },

  // Écran 3 — Attrape les cœurs
  catchHearts: {
    title: "Attrape les cœurs ! 💕",
    instructions: "Clique sur les cœurs avant qu'ils disparaissent !",
    goal: 15,
    timeLimit: 20, // secondes
    successMessage: "Bravo, tu as attrapé tous les cœurs ! 🏆",
    failMessage: "Pas assez de cœurs... On réessaie ? 💪",
    heartEmojis: ["❤️", "💖", "💕", "💗", "💘", "💝", "🩷"],
  },

  // Écran 4 — Quiz
  quiz: {
    title: "Quiz de notre couple 💑",
    questions: [
      {
        question: "Quel est notre film préféré ensemble ? 🎬",
        options: ["Titanic", "The Notebook", "La La Land", "Up"],
        correct: 2,
        hint: "Indice : 🎵🌃",
      },
      {
        question: "Où s'est passé notre premier rendez-vous ? 📍",
        options: ["Restaurant", "Cinéma", "Parc", "Café"],
        correct: 3,
        hint: "Indice : ☕",
      },
      {
        question: "Quelle est ma couleur préférée ? 🎨",
        options: ["Rouge", "Bleu", "Vert", "Violet"],
        correct: 0,
        hint: "Indice : la couleur de l'amour 💕",
      },
      {
        question: "Quel est notre plat à commander ensemble ? 🍕",
        options: ["Pizza", "Sushi", "Burger", "Pasta"],
        correct: 1,
        hint: "Indice : 🇯🇵",
      },
      {
        question: "Quel surnom je te donne le plus ? 💬",
        options: ["Mon cœur", "Bébé", "Mon ange", "Chaton"],
        correct: 0,
        hint: "Indice : ❤️",
      },
    ],
  },

  // Écran 5 — Memory
  memory: {
    title: "Jeu de mémoire 🧠💕",
    subtitle: "Trouve toutes les paires !",
    pairs: ["❤️", "💖", "💕", "🥰", "💘", "😍"],
    successMessage: "Perfect match ! Comme nous deux 💑",
  },

  // Écran 6 — Final
  final: {
    revealMessage:
      "Chaque jour avec toi est un cadeau. Tu es la personne la plus incroyable que je connaisse, et je suis tellement chanceux(se) de t'avoir dans ma vie. Je t'aime plus que les mots ne peuvent le dire... 💖",
    unlockLabel: "Déverrouille ta surprise 🎁",
    secretCode: "1402", // 14 février !
    codeHint: "Indice : la date de la Saint-Valentin (JJMM) 💕",
    finalMessage: "Tu pourras aller réclamer ton dû à ton homme ❤️",
    restartButton: "Recommencer l'aventure 🔄",
    galleryTitle: "Nos plus beaux moments 📸",
  },

  // Messages généraux
  general: {
    loading: "Chargement... 💕",
    reduceMotion: "Animations réduites activées",
  },
};
