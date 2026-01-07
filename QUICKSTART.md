# 🚀 Guide de Démarrage Rapide

Votre agent d'actualités est prêt ! Suivez ces étapes pour le lancer.

## ✅ Ce qui est déjà fait

- ✅ Projet créé avec tous les fichiers
- ✅ Configuration avec vos identifiants Financial Times
- ✅ 20+ sources RSS configurées (Finance, IA, Santé, Tech)
- ✅ Système de scoring intelligent (0-10)
- ✅ Interface web moderne (dark mode premium)

## 📋 Étapes à suivre

### 1️⃣ Installer Node.js (si pas déjà fait)

**Option A - Avec Homebrew (recommandé):**
```bash
brew install node
```

**Option B - Téléchargement direct:**
Allez sur [nodejs.org](https://nodejs.org/) et téléchargez la version LTS.

**Vérifiez l'installation:**
```bash
node --version
npm --version
```

### 2️⃣ Obtenir une clé API Gemini (GRATUIT - 2 minutes)

1. Allez sur **https://ai.google.dev/**
2. Cliquez sur **"Get API key"** (en haut à droite)
3. Connectez-vous avec votre compte Google
4. Créez un nouveau projet (ou sélectionnez-en un)
5. Cliquez sur **"Create API key"**
6. **Copiez la clé** (elle ressemble à: `AIzaSy...`)

### 3️⃣ Configurer la clé API

Ouvrez le fichier `.env` et remplacez la ligne:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Par:
```
GEMINI_API_KEY=AIzaSy...votre_vraie_cle
```

**Note:** Vos identifiants FT sont déjà configurés ✅

### 4️⃣ Installer les dépendances

```bash
cd /Users/mauraisingabriel/.gemini/antigravity/scratch/daily-news-agent
npm install
```

### 5️⃣ Lancer l'application

```bash
npm start
```

Vous verrez:
```
🚀 Daily News Agent Server Started!
📡 Server running on: http://localhost:3000
```

### 6️⃣ Ouvrir dans le navigateur

Ouvrez **http://localhost:3000** dans votre navigateur.

L'application va:
1. Récupérer les articles des 20+ sources
2. Calculer le score d'importance de chaque article
3. Filtrer pour ne garder que les plus importants (score ≥ 7)
4. Générer un résumé IA avec Gemini
5. Afficher tout dans une interface moderne

## 🎯 Utilisation quotidienne

### Routine matinale (5-10 minutes):

1. **Ouvrez l'application** → http://localhost:3000
2. **Lisez le résumé quotidien** en haut (points clés)
3. **Cliquez sur l'onglet Finance** pour voir les articles financiers
4. **Regardez les scores** (⭐ 9-10 = très important)
5. **Cliquez sur un article** pour lire la source complète

### Catégories disponibles:

- 💰 **Finance** - FT, WSJ, Bloomberg, Reuters, The Economist
- 🤖 **IA** - MIT Tech Review, TechCrunch AI, VentureBeat
- 🏥 **Santé** - STAT News, Healthcare IT News, FierceBiotech
- 💻 **Tech** - TechCrunch, The Verge, Ars Technica
- 🌍 **Général** - BBC, Reuters, The Guardian

## 🎨 Fonctionnalités de l'interface

- **Résumé quotidien** - Généré par IA, structuré par thème
- **Statistiques** - Nombre d'articles, score moyen, etc.
- **Filtrage par catégorie** - Onglets pour chaque domaine
- **Scores d'importance** - Chaque article a un score 0-10
- **Codes couleur** - Rouge (9-10), Orange (8-9), Vert (7-8)
- **Bouton Actualiser** - Force le rafraîchissement des données
- **Auto-refresh** - Toutes les 30 minutes automatiquement

## 🔧 Personnalisation

### Changer le score minimum:

Dans `.env`, modifiez:
```
MIN_IMPORTANCE_SCORE=7  # Changez à 6 pour plus d'articles, 8 pour moins
```

### Changer le nombre d'articles par catégorie:

```
MAX_ARTICLES_PER_CATEGORY=10  # Changez à 15 ou 20 si vous voulez plus
```

## 📱 API Endpoints

Vous pouvez aussi utiliser l'API directement:

```bash
# Tous les articles
curl http://localhost:3000/api/news

# Articles finance uniquement
curl http://localhost:3000/api/news/finance

# Résumé quotidien
curl http://localhost:3000/api/summary

# Statistiques
curl http://localhost:3000/api/stats
```

## 💡 Conseils pour les entretiens

### Ce qu'il faut retenir chaque matin:

1. **Événements financiers majeurs** (Fed, BCE, résultats d'entreprises)
2. **Chiffres clés** (inflation, PIB, cours de bourse)
3. **Grandes tendances** (IA, tech, géopolitique)
4. **Contexte** - Pourquoi c'est important

### Exemple d'utilisation:

**Question en entretien:** *"Qu'avez-vous lu récemment dans l'actualité financière ?"*

**Votre réponse:** *"Ce matin, j'ai lu que [événement du résumé quotidien]. C'est important car [contexte du résumé]. Cela pourrait impacter [votre analyse]."*

## 🆘 Problèmes courants

### "command not found: npm"
→ Installez Node.js (étape 1)

### Pas de résumés IA
→ Vérifiez que GEMINI_API_KEY est configurée dans `.env`

### Peu d'articles affichés
→ Réduisez MIN_IMPORTANCE_SCORE à 6 dans `.env`

### Port 3000 déjà utilisé
→ Changez PORT=3001 dans `.env`

## 📞 Support

Pour toute question, consultez le `README.md` complet.

---

**Prêt à commencer ? Lancez `npm install` puis `npm start` !** 🚀
