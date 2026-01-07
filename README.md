# 📰 Daily News Agent

Agent IA intelligent qui récupère, filtre par importance, et résume automatiquement l'actualité financière mondiale et les grandes actualités tous domaines confondus. Parfait pour développer une culture générale et se préparer aux entretiens en finance.

## ✨ Fonctionnalités

- 🎯 **Tri intelligent par importance** - L'IA évalue chaque article (score 0-10) basé sur:
  - Priorité de la source
  - Mots-clés d'importance
  - Qualité et longueur du contenu
  - Fraîcheur de l'information
  - Présence de données factuelles

- 📊 **Score de qualité** - Seuls les articles avec un score ≥ 7/10 sont affichés
- 💼 **Focus finance** - Sources premium (FT, WSJ, Bloomberg, Reuters, The Economist)
- 🌍 **Actualités majeures** - Événements importants tous domaines (IA, santé, tech, géopolitique)
- 📝 **Résumés IA structurés** - Générés par Gemini avec points clés et contexte
- 🎨 **Interface moderne** - Dark mode premium avec glassmorphism
- ⚡ **Performance optimisée** - Cache intelligent et rafraîchissement automatique

## 📋 Prérequis

- **Node.js** (version 16 ou supérieure)
- **npm** (inclus avec Node.js)
- **Clé API Gemini** (gratuite) - [Obtenir ici](https://ai.google.dev/)

## 🚀 Installation

### Étape 1: Installer Node.js

Si Node.js n'est pas installé, téléchargez-le depuis [nodejs.org](https://nodejs.org/) ou utilisez Homebrew:

```bash
brew install node
```

Vérifiez l'installation:
```bash
node --version
npm --version
```

### Étape 2: Installer les dépendances

```bash
cd /Users/mauraisingabriel/.gemini/antigravity/scratch/daily-news-agent
npm install
```

### Étape 3: Configuration

1. Copiez le fichier d'exemple:
```bash
cp .env.example .env
```

2. Éditez `.env` et ajoutez votre clé API Gemini:
```bash
nano .env
```

Remplacez `your_gemini_api_key_here` par votre vraie clé API.

**Pour obtenir une clé API Gemini gratuite:**
1. Allez sur [https://ai.google.dev/](https://ai.google.dev/)
2. Cliquez sur "Get API key"
3. Créez un projet et générez une clé
4. Copiez la clé dans votre fichier `.env`

### Étape 4: Lancer l'application

```bash
npm start
```

L'application sera accessible sur: **http://localhost:3000**

## 📖 Utilisation

### Interface Web

1. Ouvrez votre navigateur sur `http://localhost:3000`
2. Le résumé quotidien s'affiche en haut
3. Utilisez les onglets pour filtrer par catégorie:
   - **Tout** - Tous les articles importants
   - **Finance** - Actualités financières et économiques
   - **Bourse** - Marchés boursiers et trading
   - **IA** - Développements en intelligence artificielle
   - **Santé** - Actualités médicales et biotech
   - **Tech** - Technologie générale
   - **Europe** - Actualités européennes et UE
   - **France** - Actualités françaises
   - **Monde** - Actualités internationales
   - **Général** - Événements mondiaux majeurs

4. Cliquez sur un article pour lire la source complète
5. Utilisez le bouton "Actualiser" pour forcer un rafraîchissement

### API Endpoints

L'application expose plusieurs endpoints API:

```bash
# Tous les articles importants
GET http://localhost:3000/api/news

# Articles par catégorie
GET http://localhost:3000/api/news/finance
GET http://localhost:3000/api/news/ai

# Résumé quotidien global
GET http://localhost:3000/api/summary

# Résumé par catégorie
GET http://localhost:3000/api/summary/finance

# Statistiques
GET http://localhost:3000/api/stats

# Forcer le rafraîchissement
POST http://localhost:3000/api/refresh
```

## ⚙️ Configuration

### Variables d'environnement (.env)

```bash
# Port du serveur
PORT=3000

# Clé API Gemini (REQUIS pour les résumés IA)
GEMINI_API_KEY=your_key_here

# Score minimum d'importance (0-10)
MIN_IMPORTANCE_SCORE=7

# Nombre maximum d'articles par catégorie
MAX_ARTICLES_PER_CATEGORY=10

# Catégories actives (séparées par des virgules)
NEWS_CATEGORIES=finance,ai,healthcare,tech,general,europe,france,monde,bourse
```

### Personnaliser les sources

Éditez `news-sources.js` pour:
- Ajouter de nouvelles sources RSS
- Modifier les priorités des sources
- Ajouter des mots-clés d'importance
- Créer de nouvelles catégories

## 🎯 Système de scoring

Chaque article reçoit un score d'importance (0-10) basé sur:

1. **Priorité de la source** (5-10 points de base)
   - Financial Times, WSJ, Bloomberg: 9-10
   - Reuters, The Economist: 8-9
   - Autres sources: 5-8

2. **Mots-clés d'importance** (+0.5 par mot-clé, max +3)
   - Finance: "fed", "inflation", "recession", "merger", "ipo", etc.
   - IA: "breakthrough", "gpt", "regulation", "agi", etc.
   - Santé: "fda approval", "clinical trial", "cure", etc.

3. **Qualité du contenu** (+1 à +2)
   - Articles longs et substantiels

4. **Indicateurs d'importance** (+0.5 à +1.5)
   - Mots comme "breaking", "major", "historic", "billion", etc.

5. **Fraîcheur** (+0.5)
   - Articles publiés dans les dernières 24h

6. **Données factuelles** (+0.5)
   - Présence de chiffres, pourcentages, montants

**Seuls les articles avec un score ≥ 7/10 sont affichés par défaut.**

## 🔧 Dépannage

### Problème: "command not found: npm"
**Solution:** Installez Node.js depuis [nodejs.org](https://nodejs.org/)

### Problème: Pas de résumés IA
**Solution:** Vérifiez que `GEMINI_API_KEY` est configurée dans `.env`

### Problème: Peu d'articles affichés
**Solution:** Réduisez `MIN_IMPORTANCE_SCORE` dans `.env` (ex: 6 au lieu de 7)

### Problème: Erreurs de connexion RSS
**Solution:** Certains flux RSS peuvent être temporairement indisponibles. Attendez quelques minutes et rafraîchissez.

## 📚 Sources d'actualités

### Finance (Priorité maximale)
- Financial Times (World Economy, Companies)
- Wall Street Journal (Markets)
- Reuters Business
- Bloomberg Markets
- The Economist (Finance & Economics)

### Intelligence Artificielle
- MIT Technology Review AI
- TechCrunch AI
- VentureBeat AI
- AI News

### Santé & Biotech
- STAT News
- Healthcare IT News
- FierceBiotech

### Technologie
- TechCrunch
- The Verge
- Ars Technica

### Bourse & Marchés
- MarketWatch
- Investing.com
- Yahoo Finance
- Seeking Alpha
- Les Echos Bourse

### Europe
- Euronews
- Politico Europe
- The Guardian Europe
- EU Reporter

### France
- Le Monde
- Le Figaro
- France 24
- RFI

### Monde
- BBC World
- Reuters International
- Al Jazeera
- DW News

### Actualités Générales
- BBC World News
- Reuters World News
- The Guardian World

## 🎨 Captures d'écran

L'interface utilise:
- **Dark mode** élégant avec palette financière (bleu profond, or)
- **Glassmorphism** pour les cartes et surfaces
- **Animations fluides** et micro-interactions
- **Typographie premium** (Inter + Playfair Display)
- **Design responsive** pour mobile, tablet, desktop

## 📝 Utilisation pour les entretiens

### Routine matinale recommandée:

1. **Ouvrez l'application** chaque matin
2. **Lisez le résumé quotidien** (2-3 minutes)
3. **Parcourez les articles Finance** (score ≥ 9)
4. **Notez les chiffres clés** et événements majeurs
5. **Explorez 2-3 articles** en profondeur

### Points à retenir pour les entretiens:

- **Événements financiers majeurs** (décisions Fed, résultats d'entreprises)
- **Tendances économiques** (inflation, croissance, marchés)
- **Innovations technologiques** (IA, fintech)
- **Contexte géopolitique** (impact sur les marchés)

## 🚀 Améliorations futures

- [ ] Planification automatique (cron job quotidien)
- [ ] Export PDF du résumé quotidien
- [ ] Notifications push pour événements majeurs
- [ ] Analyse de sentiment avancée
- [ ] Graphiques de tendances
- [ ] Support multilingue
- [ ] Intégration Financial Times premium (avec authentification)

## 📄 Licence

MIT

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à:
- Ajouter de nouvelles sources RSS
- Améliorer l'algorithme de scoring
- Proposer de nouvelles fonctionnalités

---

**Développé avec ❤️ pour les professionnels de la finance**
