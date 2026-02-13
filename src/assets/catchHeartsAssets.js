/**
 * catchHeartsAssets.js — Assets pour le mini-jeu "Attrape les cœurs"
 * GIFs garçons/chiens (decoys), cœurs, spéciaux
 */

export const catchHeartsAssets = {
  hearts: [
    "/assets/game/catchhearts/hearts/heart1.png"
  ],
  decoys: {
    boys: [
      "/assets/game/catchhearts/decoys/boys/boy1.gif",
      "/assets/game/catchhearts/decoys/boys/boy2.gif",
      "/assets/game/catchhearts/decoys/boys/boy3.gif"
    ],
    dogs: [
      "/assets/game/catchhearts/decoys/dogs/dog1.gif",
      "/assets/game/catchhearts/decoys/dogs/dog2.gif",
      "/assets/game/catchhearts/decoys/dogs/dog3.gif"
    ]
  },
  special: {
    jealousy: "/assets/game/catchhearts/special/jealousy.gif",
    runnerDog: "/assets/game/catchhearts/special/runnerDog.gif"
  },
  // Fallback emojis si asset manquant
  fallback: {
    heart: "💖",
    boy: "🧍‍♂️",
    dog: "🐶",
    jealousy: "😈",
    runnerDog: "🐕‍🦺"
  }
};
