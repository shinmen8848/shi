#!/bin/bash

echo "🚀 Setting up Shinmen Platform..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start database services
echo "📦 Starting database services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install root dependencies
echo "📥 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📥 Installing backend dependencies..."
cd apps/backend
npm install

# Install frontend dependencies
echo "📥 Installing frontend dependencies..."
cd ../frontend
npm install
cd ../..

# Run database migrations
echo "🗄️ Setting up database..."
cd apps/backend
npm run db:migrate
cd ../..

echo "✅ Setup complete!"
echo ""
echo "🎉 Shinmen Platform is ready!"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:3001"
echo ""
echo "Database services are running in Docker."
echo "Use 'docker-compose down' to stop them."