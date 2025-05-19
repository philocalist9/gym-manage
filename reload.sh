#!/bin/bash

# This script helps fix stale file references in VS Code
# It will clean relevant caches that might be causing errors for deleted files

echo "Cleaning Next.js cache..."
rm -rf .next

echo "Cleaning TypeScript cache..."
rm -f tsconfig.tsbuildinfo

echo "Creating a temporary file to help VS Code refresh..."
echo "// Temporary file to force refresh" > temp_refresh_$RANDOM.ts
sleep 1
rm temp_refresh_*.ts

echo "Done! Please run Developer: Reload Window in VS Code (Press Cmd+Shift+P and search for it)"
