# 🚀 Guide de déploiement GitHub et Render

## Étape 1: Créer un dépôt GitHub

1. Allez sur [github.com](https://github.com)
2. Cliquez sur **"New repository"** (bouton vert)
3. Configurez le dépôt :
   - **Repository name:** `DailyNewsAgent` (ou le nom de votre choix)
   - **Description:** "AI-powered news aggregator with 9 categories and chat assistant"
   - **Visibility:** Public ou Private (votre choix)
   - **⚠️ NE PAS** cocher "Add a README file"
   - **⚠️ NE PAS** ajouter .gitignore ou license
4. Cliquez sur **"Create repository"**

## Étape 2: Pousser le code sur GitHub

Une fois le dépôt créé, GitHub vous donnera une URL comme :
```
https://github.com/VOTRE-USERNAME/DailyNewsAgent.git
```

Exécutez ces commandes :

```bash
cd /Users/mauraisingabriel/Documents/DailyNewsAgent

# Ajouter le remote
git remote add origin https://github.com/VOTRE-USERNAME/DailyNewsAgent.git

# Pousser le code
git branch -M main
git push -u origin main
```

## Étape 3: Déployer sur Render

### 3.1 Créer un compte Render

1. Allez sur [render.com](https://render.com)
2. Cliquez sur **"Get Started"**
3. Connectez-vous avec votre compte GitHub

### 3.2 Créer un Web Service

1. Dans le dashboard Render, cliquez sur **"New +"** → **"Web Service"**
2. Connectez votre dépôt GitHub `DailyNewsAgent`
3. Configurez le service :
   - **Name:** `daily-news-agent` (ou votre choix)
   - **Region:** Europe (Frankfurt) ou le plus proche
   - **Branch:** `main`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free

### 3.3 Configurer les variables d'environnement

Dans la section **Environment**, ajoutez ces variables :

```
GEMINI_API_KEY=votre_clé_gemini_ici
PORT=3000
MIN_IMPORTANCE_SCORE=7
MAX_ARTICLES_PER_CATEGORY=10
NEWS_CATEGORIES=finance,ai,healthcare,tech,general,europe,france,monde,bourse
```

**⚠️ IMPORTANT:** Remplacez `votre_clé_gemini_ici` par votre vraie clé API Gemini

### 3.4 Déployer

1. Cliquez sur **"Create Web Service"**
2. Attendez 2-3 minutes que le déploiement se termine
3. Votre app sera accessible sur : `https://daily-news-agent.onrender.com`

## Étape 4: Tester l'application

1. Ouvrez l'URL Render dans votre navigateur
2. Vérifiez que les 9 catégories s'affichent
3. Testez le chat assistant (bouton 💬 en bas à droite)
4. Ouvrez l'URL sur votre téléphone pour tester la version mobile

## Mises à jour futures

Pour déployer de nouvelles modifications :

```bash
cd /Users/mauraisingabriel/Documents/DailyNewsAgent

# Faire vos modifications...

# Committer et pousser
git add .
git commit -m "Description des changements"
git push
```

Render redéploiera automatiquement votre application !

## Dépannage

### Problème : L'app ne démarre pas sur Render
**Solution:** Vérifiez que `GEMINI_API_KEY` est bien configurée dans les variables d'environnement

### Problème : Pas d'articles affichés
**Solution:** Attendez 1-2 minutes que le cache se remplisse au premier démarrage

### Problème : Le chat ne fonctionne pas
**Solution:** Vérifiez que la clé Gemini est valide et que vous n'avez pas dépassé le quota gratuit

## Support

Si vous rencontrez des problèmes :
1. Consultez les logs dans Render (onglet "Logs")
2. Vérifiez que toutes les variables d'environnement sont configurées
3. Assurez-vous que le port 3000 est bien configuré
