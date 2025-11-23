#!/bin/bash

echo "🚀 Updating Sekido..."

# Stash local changes (mainly config.ts)
echo "📦 Stashing local changes..."
git stash push -m "Local config before update"

# Pull latest changes
echo "⬇️  Pulling latest changes..."
git pull origin main

# Restore local changes
echo "📋 Restoring local config..."
git stash pop

# Deploy updated app
echo "🌐 Deploying to Cloudflare..."
wrangler deploy

echo "✅ Update complete! Your app is now live with the latest features."
