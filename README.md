# 💖 Mini-site Saint-Valentin

Un site web interactif et animé pour la Saint-Valentin, avec mini-jeux, animations GSAP, et beaucoup d'amour !

## 🚀 Lancer le projet

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Construire pour la production
npm run build

# Prévisualiser le build
npm run preview
```

## 🎨 Personnaliser le contenu

### Textes et messages
Modifie le fichier `src/content.js` — tous les textes sont centralisés ici :
- Titres et sous-titres
- Questions du quiz (et réponses correctes)
- Messages de l'écran Valentine
- Code secret (par défaut : `1402`)

### Photos et GIFs
Place tes fichiers dans `public/assets/gifs/` :
- `photo1.gif` à `photo6.gif` — galerie finale
- `hearts.gif`, `love.gif`, etc. — décoratifs

Si les images manquent, des emojis sont affichés en fallback.

### Musique
Place un fichier MP3 dans `public/assets/audio/background.mp3`.

### Configuration des assets
Modifie `src/assets.js` pour changer les chemins d'images et les emojis de fallback.

## 📱 Parcours utilisateur (6 écrans)

1. **Accueil** — Titre typing + glow, bouton "Commencer"
2. **Valentine** — Le bouton "Non" fuit, le "Oui" grandit !
3. **Attrape les cœurs** — Mini-jeu de rapidité
4. **Quiz couple** — Questions personnalisables
5. **Memory** — Jeu de paires avec flip animé
6. **Cadeau final** — Message, galerie, code secret, déclaration

## 🛠️ Déploiement

### Netlify
```bash
npm run build
# Déployer le dossier `dist/`
```

### Vercel
```bash
npx vercel
```

### GitHub Pages
```bash
npm run build
# Push le dossier `dist/` sur la branche gh-pages
```

## 💻 Stack technique
- **Vite** — Bundler rapide
- **Vanilla JS** — Pas de framework
- **GSAP** — Animations fluides
- **Canvas API** — Particules de fond

---

Fait avec 💖
