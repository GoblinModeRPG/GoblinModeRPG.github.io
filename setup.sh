#!/bin/bash

echo "🎲 GoblinMode Setup Script"
echo "=========================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm version: $(npm -v)"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check for .env file
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating template..."
    cat > .env << EOF
AGORA_APP_ID=your_agora_app_id_here
AGORA_APP_CERTIFICATE=your_agora_certificate_here
EOF
    echo "✅ Created .env template"
    echo ""
    echo "⚠️  IMPORTANT: Please edit .env and add your Agora credentials:"
    echo "   1. Go to https://console.agora.io/"
    echo "   2. Get your App ID and Certificate"
    echo "   3. Edit .env and replace the placeholder values"
    echo ""
else
    echo "✅ .env file found"
    
    # Check if credentials are set
    if grep -q "your_agora_app_id_here" .env || grep -q "your_agora_certificate_here" .env; then
        echo "⚠️  Warning: .env contains placeholder values"
        echo "   Please update with your actual Agora credentials"
        echo ""
    else
        echo "✅ Agora credentials appear to be configured"
        echo ""
    fi
fi

# Test if backend can start
echo "🔧 Testing backend server..."
timeout 3 node server.js &> /dev/null &
BACKEND_PID=$!
sleep 2

if curl -s http://127.0.0.1:8000/health &> /dev/null; then
    echo "✅ Backend server is working"
    kill $BACKEND_PID 2>/dev/null
else
    echo "⚠️  Backend server test failed (this is normal if Agora credentials aren't set yet)"
    kill $BACKEND_PID 2>/dev/null
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "  1. Make sure your Agora credentials are in .env (if running locally)"
echo "  2. Start the app:"
echo ""
echo "     Option A - Quick start (both servers):"
echo "     $ npm start"
echo ""
echo "     Option B - Manual (two terminals):"
echo "     Terminal 1: $ npm run server"
echo "     Terminal 2: $ npm run dev"
echo ""
echo "  3. Open http://localhost:5000 in your browser"
echo ""
echo "📚 For more information, see README.md"
echo ""
