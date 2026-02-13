/**
 * sarcasmDecoyLines.js — Phrases sarcastiques pour les decoys (garçons + chiens)
 * Ton : piquant pour boys, mignon sarcastique pour dogs
 * Inclut des "rare lines" (2-3% de chance)
 */

export const sarcasmDecoyLines = {
  boy: [
    "C'EST PAS UN CŒUR ÇA MADAME.",
    "Sérieusement ? Un garçon ? T'as pas honte ?",
    "NOPE. Pas lui. Moi.",
    "Tu cliques un boy et tu perds des points. Coïncidence ? Non.",
    "Hey oh, les cœurs sont ROSES. Pas musclés.",
    "Mauvais clic. Mauvais goût. Double peine.",
    "Ce garçon vaut -3 points. Comme son charisme.",
    "ERREUR. FATALE. Enfin presque.",
    "T'as cliqué un boy. Mon ego prend -10.",
    "Ah bravo, tu dragues pendant MON jeu.",
    "Le boy : 'Bonjour.' Moi : 'Au revoir.'",
    "Chaque boy cliqué = un point de jalousie en plus.",
    "Tu vises les cœurs ou les abdos ? Concentre-toi.",
    "Ce garçon n'a rien à faire ici. Comme ton clic.",
    "FAUX. Les cœurs ont pas de tête. Ni de barbe.",
    "Un boy ? Vraiment ? Pendant NOTRE jeu ?",
    "Score : -3. Dignité : en chute libre.",
    "Boy détecté. Jalousie activée.",
    "C'est un piège et t'es tombée dedans. Classic.",
    "Le garçon dit merci. Moi je dis -3 points.",
    "T'as les yeux sur les cœurs ou sur les boys ?",
    "Mauvaise cible. Bon réflexe quand même. Mais non.",
    "Le boy est flatté. Moi non.",
    "CLIQUE. LES. CŒURS. PAS. LES. MECS.",
    "Si tu cherches l'amour, c'est les trucs roses.",
    "-3 points et une leçon de vie.",
    "Un boy de plus, un point de moins. La logique.",
    "T'as un radar à boys ou quoi ?",
    "Ce garçon a été placé là pour tester ta fidélité. T'as raté.",
    "Le site note tout. TOUT. Surtout les boys.",
    "Boy cliqué : rapport envoyé à mon ego.",
    "C'est drôle parce que c'est pas un cœur.",
    "Le garçon est content. Pas moi.",
    "Erreur de casting. Littéralement.",
    "Bon… on va pas en faire un drame. Si en fait. -3.",
    "Boy intercepté. Points confisqués.",
    "T'as failli me vexer. T'as réussi en fait.",
    "Ce boy vaut 0 point. Comme sa coupe de cheveux.",
    "Le prochain boy que tu cliques, c'est la guerre.",
    "T'es censée attraper des CŒURS pas des MECS.",
    // Rare lines (2-3%)
    "Ok j'avoue… celui-là même moi je l'aurais cliqué.",
    "Bon… il est pas mal. Mais CLIQUE LES CŒURS.",
    "Ce boy a du style. Mais t'as -3 points quand même.",
    "Putain il est beau gosse lui. NON. Concentre-toi.",
    "Ok celui-là je comprends. Mais c'est quand même FAUX.",
  ],
  dog: [
    "C'est un chien. C'est mignon. Mais c'est pas un cœur.",
    "WOOF. Traduction : 'T'as perdu des points.'",
    "Le chien te juge. Et moi aussi.",
    "Un chien ? Sérieusement ? -3 points de dignité.",
    "Ce chien est adorable. Mais ça reste -3.",
    "Le toutou dit bonjour. Ton score dit au revoir.",
    "Dog detected. Points destroyed.",
    "Il est mignon. Tes points moins.",
    "BZZZ. Mauvais animal. On cherche des cœurs ici.",
    "Ce chien vaut tout l'amour du monde. Mais pas de points.",
    "T'as cliqué un chien. C'est pas méchant mais c'est pas malin.",
    "Le chien est content du clic. Ton score non.",
    "Woof woof = -3 en langue canine.",
    "T'as raté un cœur pour un chien. Bilan mitigé.",
    "Un bon garçon, oui. Un bon clic, non.",
    "Ce doggo méritait pas ça. Ton score non plus.",
    "Le chien est innocent. Ton clic beaucoup moins.",
    "Attention : les chiens sont des pièges mignons.",
    "Chien piège activé. Tu t'es fait avoir.",
    "C'est pas parce qu'il est cute qu'il faut cliquer.",
    "Le toutou est ravi. Tes points pleurent.",
    "CHIEN ≠ CŒUR. Rappel nécessaire visiblement.",
    "Il remue la queue. Ton score remue vers le bas.",
    "T'es du genre à caresser tous les chiens dans la rue hein ?",
    "Chien touché, cœur manqué, score diminué.",
    "Ce toutou est mignon comme tout. Mais -3.",
    "Le chien te pardonne. Le scoreboard non.",
    "Tu cliques les chiens parce que t'es trop gentille. C'est ton défaut.",
    "Dog tax : -3 points. Pas d'exception.",
    "Il a les yeux doux mais ça vaut pas de points.",
    "Le chien a gagné ton clic. Toi t'as perdu 3 points.",
    "C'est une zone de cœurs ici. Pas un parc canin.",
    "Chien repéré, clic regretté.",
    "Aww le petit chien… AH NON. -3 points.",
    "Le chien dit woof. Le jeu dit -3.",
    "Trop de compassion, pas assez de stratégie.",
    "Ce chien est un agent double. Tu t'es fait piéger.",
    "Adorable piège canin : succès.",
    "T'as un faible pour les chiens. Le jeu a un faible pour les cœurs.",
    "Dog cliqué : le refuge te remercie. Le score non.",
    // Rare lines (2-3%)
    "Ok ce chien est tellement mignon que je te pardonne. Presque.",
    "Même moi j'aurais cliqué ce chien. Bon. -3 quand même.",
    "Ce toutou est illégalement mignon. Pas de points mais du respect.",
    "Le plus beau chien du jeu. -3 points mais +100 en humanité.",
    "Ce chien mérite un Oscar. Toi tu mérites -3 points.",
  ],
  // Indices des rare lines (derniers 5 de chaque array)
  rareStartIndex: {
    boy: 40,
    dog: 40,
  },
};

/**
 * Récupère une phrase sarcastique pour un type de decoy
 * @param {string} type - "boy" | "dog"
 * @returns {string}
 */
export function getSarcasmLine(type) {
  const lines = sarcasmDecoyLines[type];
  if (!lines || lines.length === 0) return "Raté !";

  const rareStart = sarcasmDecoyLines.rareStartIndex[type] || lines.length;

  // 2.5% de chance de rare line
  if (Math.random() < 0.025 && rareStart < lines.length) {
    const rarePool = lines.slice(rareStart);
    return rarePool[Math.floor(Math.random() * rarePool.length)];
  }

  // Ligne normale (hors rare pool)
  const normalPool = lines.slice(0, rareStart);
  return normalPool[Math.floor(Math.random() * normalPool.length)];
}
