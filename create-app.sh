#!/bin/bash

# Script pour créer une application macOS (.app)
# Cela permet de lancer l'application en double-cliquant

APP_NAME="Daily News Agent"
APP_DIR="$APP_NAME.app"
CONTENTS_DIR="$APP_DIR/Contents"
MACOS_DIR="$CONTENTS_DIR/MacOS"
RESOURCES_DIR="$CONTENTS_DIR/Resources"

echo "📦 Création de l'application macOS..."

# Créer la structure de l'application
mkdir -p "$MACOS_DIR"
mkdir -p "$RESOURCES_DIR"

# Créer le script de lancement
cat > "$MACOS_DIR/$APP_NAME" << 'EOF'
#!/bin/bash

# Obtenir le chemin du projet
PROJECT_DIR="/Users/mauraisingabriel/.gemini/antigravity/scratch/daily-news-agent"

# Ouvrir un terminal et lancer l'application
osascript <<APPLESCRIPT
tell application "Terminal"
    activate
    do script "cd '$PROJECT_DIR' && ./start.sh"
end tell
APPLESCRIPT
EOF

# Rendre le script exécutable
chmod +x "$MACOS_DIR/$APP_NAME"

# Créer le fichier Info.plist
cat > "$CONTENTS_DIR/Info.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CFBundleExecutable</key>
    <string>$APP_NAME</string>
    <key>CFBundleIconFile</key>
    <string>AppIcon</string>
    <key>CFBundleIdentifier</key>
    <string>com.dailynews.agent</string>
    <key>CFBundleName</key>
    <string>$APP_NAME</string>
    <key>CFBundlePackageType</key>
    <string>APPL</string>
    <key>CFBundleShortVersionString</key>
    <string>1.0</string>
    <key>CFBundleVersion</key>
    <string>1</string>
</dict>
</plist>
EOF

echo "✅ Application créée: $APP_DIR"
echo ""
echo "📍 Vous pouvez maintenant:"
echo "   1. Double-cliquer sur '$APP_DIR' pour lancer"
echo "   2. Déplacer '$APP_DIR' sur votre Bureau"
echo "   3. Ajouter '$APP_DIR' au Dock"
echo ""
echo "💡 Pour changer l'icône:"
echo "   1. Trouvez une icône .icns"
echo "   2. Clic droit sur l'app → Lire les informations"
echo "   3. Glissez l'icône sur la petite icône en haut à gauche"
