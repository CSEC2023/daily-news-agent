# 🚀 Guide de Partage avec vos Amis

## 📦 Option 1: Partager le dossier complet (Recommandé)

### Étape 1: Préparer le dossier pour le partage

**IMPORTANT:** Avant de partager, supprimez vos identifiants personnels:

1. Ouvrez le fichier `.env`
2. Remplacez vos identifiants FT par des placeholders:
   ```
   FT_EMAIL=votre_email@example.com
   FT_PASSWORD=votre_mot_de_passe
   ```
3. Ou supprimez complètement le fichier `.env` (il sera recréé depuis `.env.example`)

### Étape 2: Créer une archive

```bash
cd /Users/mauraisingabriel/.gemini/antigravity/scratch
zip -r daily-news-agent.zip daily-news-agent -x "daily-news-agent/node_modules/*" "daily-news-agent/.env"
```

Cela crée un fichier `daily-news-agent.zip` sans les dépendances (plus léger) et sans votre `.env`.

### Étape 3: Partager avec vos amis

Envoyez le fichier `daily-news-agent.zip` avec ces instructions:

**Instructions pour vos amis:**

1. **Décompresser** le fichier zip
2. **Installer Node.js** si pas déjà fait: https://nodejs.org/
3. **Obtenir une clé API Gemini gratuite**: https://ai.google.dev/
4. **Configurer** la clé dans `.env`:
   ```bash
   cp .env.example .env
   # Puis éditer .env et ajouter la clé Gemini
   ```
5. **Double-cliquer** sur `start.sh` (ou lancer `./start.sh` dans le terminal)
6. **Ouvrir** http://localhost:3000 dans le navigateur

---

## 🌐 Option 2: Déployer en ligne (Accessible partout)

Pour que vos amis puissent y accéder sans installation, déployez l'application en ligne:

### A. Déploiement sur Render (GRATUIT)

1. Créez un compte sur https://render.com/
2. Connectez votre dépôt GitHub (créez-en un d'abord)
3. Créez un nouveau "Web Service"
4. Configurez:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment Variables:** Ajoutez `GEMINI_API_KEY`
5. Déployez !

Vos amis pourront accéder via: `https://votre-app.onrender.com`

### B. Déploiement sur Railway (GRATUIT)

1. Créez un compte sur https://railway.app/
2. Cliquez sur "New Project" → "Deploy from GitHub"
3. Sélectionnez votre dépôt
4. Ajoutez les variables d'environnement
5. Déployez !

### C. Déploiement sur Vercel (GRATUIT)

1. Créez un compte sur https://vercel.com/
2. Importez votre projet GitHub
3. Configurez les variables d'environnement
4. Déployez !

---

## 🖥️ Option 3: Créer une application macOS (Double-clic)

### Créer une application .app

Je vais créer une vraie application macOS que vous pouvez mettre sur votre bureau:

```bash
cd /Users/mauraisingabriel/.gemini/antigravity/scratch/daily-news-agent
./create-app.sh
```

Cela créera `Daily News Agent.app` que vous pouvez:
- Mettre sur votre **Bureau**
- Ajouter au **Dock**
- Lancer en **double-cliquant**

---

## 📱 Option 4: Créer un raccourci Bureau

### Sur macOS:

1. Ouvrez **Automator**
2. Créez une nouvelle **Application**
3. Ajoutez l'action "Exécuter un script Shell"
4. Collez:
   ```bash
   cd /Users/mauraisingabriel/.gemini/antigravity/scratch/daily-news-agent
   ./start.sh
   ```
5. Enregistrez comme "Daily News Agent" sur le Bureau
6. Changez l'icône (clic droit → Lire les informations)

---

## 🔄 Automatisation quotidienne

### Lancer automatiquement chaque matin

Créez un cron job ou utilisez **launchd** sur macOS:

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne pour lancer à 8h00 chaque jour
0 8 * * * cd /Users/mauraisingabriel/.gemini/antigravity/scratch/daily-news-agent && ./start.sh
```

---

## 📧 Recevoir le résumé par email

Ajoutez un script qui envoie le résumé quotidien par email:

```bash
# Dans le dossier du projet
node send-email-summary.js
```

(Je peux créer ce script si vous voulez)

---

## 💡 Recommandations

**Pour vous:**
- Utilisez `./start.sh` pour lancer rapidement
- Créez un raccourci sur le Bureau
- Configurez un lancement automatique le matin

**Pour vos amis:**
- Partagez le zip (Option 1) si ils sont techniques
- Déployez en ligne (Option 2) si ils veulent juste utiliser
- Créez un guide simple avec captures d'écran

**Pour un usage professionnel:**
- Déployez sur un serveur (Render, Railway, Vercel)
- Configurez un nom de domaine personnalisé
- Ajoutez une authentification si nécessaire

---

## 🆘 Support

Si vos amis ont des problèmes:
1. Vérifiez que Node.js est installé: `node --version`
2. Vérifiez que la clé Gemini est configurée dans `.env`
3. Vérifiez que le port 3000 est libre
4. Consultez le README.md pour plus de détails
