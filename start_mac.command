#!/bin/bash
# Summit Media Browser - Mac Launcher
# Double-click this file to start

cd "$(dirname "$0")"
echo "Starting Summit Media Browser..."
echo "Opening at http://localhost:8080"
echo ""
echo "To stop: press Ctrl+C"
echo ""

# Open browser after 1 second
(sleep 1 && open "http://localhost:8080") &

# Start server
python3 -m http.server 8080
