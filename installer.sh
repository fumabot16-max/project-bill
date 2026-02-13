#!/bin/bash

# AI Bill Intelligence - One-line Installer
# Usage: curl -fsSL [URL] | bash
# Usage (auto): curl -fsSL [URL] | bash -s -- --auto

set -e

AUTO_MODE=false
if [ "$1" == "--auto" ]; then
    AUTO_MODE=true
fi

echo "🤖 AI Bill Intelligence Installer"
echo "=================================="
echo ""

# Check and install unzip if not found
if ! command -v unzip &> /dev/null; then
    echo "📦 Installing unzip..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update -qq && sudo apt-get install -y -qq unzip
    elif command -v yum &> /dev/null; then
        sudo yum install -y unzip
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y unzip
    elif command -v brew &> /dev/null; then
        brew install unzip
    else
        echo "❌ Error: unzip not found and cannot install automatically"
        echo "   Please install unzip manually:"
        echo "   Ubuntu/Debian: sudo apt-get install unzip"
        echo "   macOS: brew install unzip"
        exit 1
    fi
    echo "✅ unzip installed!"
    echo ""
fi

# 1. Create directory
SKILL_DIR="$HOME/.openclaw/skills/ai-bill-intelligence"
mkdir -p "$SKILL_DIR"
cd "$SKILL_DIR"

# 2. Download from GitHub
echo "📥 Downloading..."
if command -v wget &> /dev/null; then
    wget -q https://github.com/fumabot16-max/project-bill/archive/refs/heads/master.zip -O master.zip
elif command -v curl &> /dev/null; then
    curl -fsSL https://github.com/fumabot16-max/project-bill/archive/refs/heads/master.zip -o master.zip
else
    echo "❌ Error: wget or curl required"
    exit 1
fi

# 3. Extract
echo "📦 Extracting..."
unzip -q master.zip
mv project-bill-master/* .
mv project-bill-master/.* . 2>/dev/null || true
rm -rf project-bill-master master.zip

# 4. Install dependencies
echo "📦 Installing dependencies..."
npm install --silent

# 5. Setup configuration
if [ "$AUTO_MODE" == true ]; then
    echo "⚙️  Auto mode: Creating default configuration..."
    cat > vault.json << 'EOF'
{
  "openai": 0,
  "claude": 0,
  "kimi": 0,
  "deepseek": 0,
  "grok": 0,
  "gemini": 0
}
EOF
    echo "✅ Default configuration created (all zeros)"
    echo "   Edit vault.json later or use web dashboard to set balances"
else
    echo ""
    echo "⚙️  Configuration"
    echo "----------------"
    node setup.js
fi

# 6. Setup systemd services or macOS launcher
echo ""
echo "🚀 Setting up services..."
if command -v systemctl &> /dev/null; then
    # Linux with systemd
    sudo cp systemd/*.service /etc/systemd/system/
    sudo systemctl daemon-reload
    sudo systemctl enable ai-bill ai-bill-collector
    sudo systemctl start ai-bill ai-bill-collector
    echo "✅ Services started!"
    echo "   Start: sudo systemctl start ai-bill ai-bill-collector"
    echo "   Stop: sudo systemctl stop ai-bill ai-bill-collector"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    chmod +x start-macos.sh
    echo "🍎 macOS detected!"
    echo ""
    ./start-macos.sh
else
    # Other systems
    echo "⚠️  Manual start required:"
    echo "   cd ~/.openclaw/skills/ai-bill-intelligence"
    echo "   node server.js &"
    echo "   node collector.js &"
fi

echo ""
echo "=================================="
echo "✅ Installation Complete!"
echo "=================================="
echo ""
echo "🌐 Dashboard: http://localhost:8003"

if [ "$AUTO_MODE" == true ]; then
    echo ""
    echo "⚠️  Auto mode was used (all balances set to 0)"
    echo "   To set your actual balances:"
    echo "   1. Edit: ~/.openclaw/skills/ai-bill-intelligence/vault.json"
    echo "   2. Or use the web dashboard to update balances"
fi

echo ""
echo "Check status:"
if command -v systemctl &> /dev/null; then
    echo "   systemctl status ai-bill ai-bill-collector"
else
    echo "   ps aux | grep node"
fi
echo "View logs:"
echo "   tail -f ~/.openclaw/skills/ai-bill-intelligence/server.log"
echo ""
