#!/bin/bash

# Script de lancement automatique du Daily News Agent
# Double-cliquez sur ce fichier pour lancer l'application

echo "🚀 Lancement du Daily News Agent..."
echo ""

# Se déplacer dans le bon répertoire
cd "$(dirname "$0")"

# Vérifier si Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé."
    echo "📥 Installez-le depuis https://nodejs.org/"
    read -p "Appuyez sur Entrée pour quitter..."
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances (première fois seulement)..."
    npm install
    echo ""
fi

# Vérifier si la clé API Gemini est configurée
if grep -q "your_gemini_api_key_here" .env 2>/dev/null; then
    echo "⚠️  ATTENTION: Clé API Gemini non configurée!"
    echo "📝 Éditez le fichier .env et ajoutez votre clé API Gemini"
    echo "🔗 Obtenez une clé gratuite sur: https://ai.google.dev/"
    echo ""
    read -p "Appuyez sur Entrée pour continuer quand même..."
fi

# Lancer le serveur
echo "🌐 Démarrage du serveur..."
echo "📡 L'application sera accessible sur: http://localhost:3000"
echo ""
echo "💡 Pour arrêter le serveur, fermez cette fenêtre ou appuyez sur Ctrl+C"
echo ""
echo "============================================================"
echo ""

# Attendre 3 secondes puis ouvrir le navigateur
(sleep 3 && open http://localhost:3000) &

# Lancer le serveur
npm start
