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
        question: "Où est-ce qu'on s'est rencontrés pour la première fois ? 📍",
        options: ["En soirée", "Au musée", "Sur Tinder", "Au travail"],
        correct: 1,
        hint: "Indice : 🖼️🎨",
      },
      {
        question: "Qu'est-ce que j'aime chez toi ? 💕",
        options: ["Ton sourire", "Ta cuisine (lol)", "Ta passion", "Ton humour douteux", "Tes fesses"],
        correct: 2,
        hint: "Indice : 🔥 Ce qui te fait briller",
      },
      {
        question: "Qu'est-ce que je déteste chez toi ? 🤔",
        options: ["Ton caractère", "Ton désordre", "Tes ronflements", "Ta jalousie"],
        correct: -1,
        noneCorrectMessage: "Piège ! Je ne déteste rien chez toi 🥰💖",
        hint: "Indice : c'est un piège… 😏",
      },
      {
        question: "Comment je nous vois dans 5 ans ? 🔮",
        options: ["Mariés avec 3 enfants", "Ultra riches 💰", "En tour du monde", "Avec 12 chats", "Avec 3 grands chiens 🐕"],
        correct: 1,
        hint: "Indice : 🤑💸",
      },
      {
        question: "Qu'est-ce qui est jaune et qui attend ? 🤣",
        options: ["Un poussin patient", "Jonathan", "Un chinois à un arrêt de bus", "Un tournesol au feu rouge"],
        correct: 2,
        hint: "Indice : 🚏😂",
      },
    ],
  },

  // Écran 5 — Memory
  memory: {
    title: "Jeu de mémoire 🧠💕",
    subtitle: "Trouve toutes les paires !",
    pairs: [
      { id: 'sticker1', src: '/assets/stickers/sticker1.png' },
      { id: 'sticker2', src: '/assets/stickers/sticker2.png' },
      { id: 'sticker3', src: '/assets/stickers/sticker3.png' },
      { id: 'sticker4', src: '/assets/stickers/sticker4.png' },
      { id: 'sticker5', src: '/assets/stickers/sticker5.png' },
      { id: 'sticker6', src: '/assets/stickers/sticker6.png' },
      { id: 'sticker7', src: '/assets/stickers/sticker7.png' },
      { id: 'sticker8', src: '/assets/stickers/sticker8.png' },
    ],
    successMessage: "Perfect match ! Comme nous deux 💑",
  },

  // Écran 6 — Final
  final: {
    revealMessage:
      "Chaque jour avec toi est un cadeau. Tu es la personne la plus incroyable que je connaisse, et je suis tellement chanceux(se) de t'avoir dans ma vie. Je t'aime plus que les mots ne peuvent le dire... 💖",
    unlockLabel: "Déverrouille ta surprise 🎁",
    secretCode: "1401", // 14 janvier — notre anniversaire !
    codeHint: "Indice : la date de notre anniversaire ensemble (JJMM) 💕",
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
