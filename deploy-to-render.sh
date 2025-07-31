#!/bin/bash

# SafetySync.AI Render Deployment Script
# This script helps prepare the application for Render deployment

echo "🚀 Preparing SafetySync.AI for Render deployment..."

# Check if required files exist
echo "✅ Checking deployment files..."
if [ ! -f "render.yaml" ]; then
    echo "❌ render.yaml not found"
    exit 1
fi

if [ ! -f ".env.example" ]; then
    echo "❌ .env.example not found"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

echo "✅ All deployment files found"

# Check Node.js version
echo "📦 Checking Node.js version..."
node_version=$(node --version)
echo "Current Node.js version: $node_version"

# Test build process
echo "🔨 Testing build process..."
npm install
if [ $? -ne 0 ]; then
    echo "❌ npm install failed"
    exit 1
fi

npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Clean up build artifacts for deployment
echo "🧹 Cleaning up for deployment..."
rm -rf node_modules/.cache
rm -rf dist/public/*.map

echo "🎉 SafetySync.AI is ready for Render deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your GitHub repo to Render"
echo "3. Use the settings from render.yaml"
echo "4. Set up environment variables from .env.example"
echo "5. Deploy!"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"