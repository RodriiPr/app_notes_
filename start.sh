#!/bin/bash
set -e

echo "🚀 Starting Notes App..."

# Check Docker
if ! command -v docker &> /dev/null; then
  echo "❌ Docker is not installed. Please install Docker first."
  exit 1
fi

if ! command -v docker compose &> /dev/null; then
  echo "❌ Docker Compose is not installed. Please install Docker Compose v2."
  exit 1
fi

# Build and start
docker compose up --build -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

echo ""
echo "✅ Notes App is running!"
echo "   → Frontend: http://localhost"
echo "   → Backend API: http://localhost:8000"
echo "   → API Docs: http://localhost:8000/docs"
echo ""
echo "To stop: docker compose down"
echo "To stop and remove data: docker compose down -v"
