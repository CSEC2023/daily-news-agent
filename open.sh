#!/bin/bash

# Script de lancement simplifié - ouvre juste le navigateur si le serveur tourne déjà

# Vérifier si le serveur est déjà en cours d'exécution
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Le serveur est déjà en cours d'exécution"
    echo "🌐 Ouverture du navigateur..."
    open http://localhost:3000
else
    echo "❌ Le serveur n'est pas en cours d'exécution"
    echo "🚀 Lancez d'abord le serveur avec ./start.sh"
    echo ""
    read -p "Voulez-vous lancer le serveur maintenant? (o/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Oo]$ ]]; then
        cd "$(dirname "$0")"
        ./start.sh
    fi
fi
