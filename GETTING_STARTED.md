# Getting Started with Shinmen

## 🚀 Quick Setup (Recommended)

Run the automated setup script:

```bash
./setup.sh
```

This will:
1. Start PostgreSQL and Redis with Docker
2. Install all dependencies
3. Run database migrations
4. Set up the development environment

## 🔧 Manual Setup

If you prefer to set up manually:

### 1. Start Database Services

```bash
docker-compose up -d
```

### 2. Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd apps/backend && npm install

# Frontend dependencies
cd ../frontend && npm install
```

### 3. Set up Database

```bash
cd apps/backend
npm run db:migrate
```

### 4. Start Development Servers

```bash
# From root directory
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 👤 First Steps

1. **Create an Account**
   - Go to http://localhost:3000
   - Click "Get Started" to register
   - Fill in your details and create an account

2. **Explore the Dashboard**
   - After login, you'll see the main dashboard
   - Navigate between Chat, IDE, and API Keys

3. **Try the Chat Playground**
   - Click on "Chat Playground"
   - Configure your AI provider settings
   - Start chatting with AI (currently simulated responses)

4. **Use the Web IDE**
   - Click on "Web IDE"
   - Explore the Monaco Editor
   - Edit files and see syntax highlighting

5. **Manage API Keys**
   - Click on "API Keys"
   - Create your first API key
   - Monitor usage and manage permissions

## 🔑 Default Configuration

The development setup includes:

- **Database**: PostgreSQL with pgvector extension
- **Cache**: Redis for sessions and real-time features
- **Authentication**: JWT with 15-minute access tokens
- **CORS**: Configured for localhost:3000

## 🛠️ Development Commands

### Backend
```bash
cd apps/backend
npm run dev          # Start development server
npm run build        # Build for production
npm run db:migrate   # Run database migrations
```

### Frontend
```bash
cd apps/frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Full Stack
```bash
npm run dev          # Start both backend and frontend
npm run build        # Build both applications
```

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if Docker services are running
docker-compose ps

# Restart services if needed
docker-compose restart

# Check logs
docker-compose logs postgres
docker-compose logs redis
```

### Port Conflicts
If ports 3000, 3001, 5432, or 6379 are in use:

1. Stop conflicting services
2. Or modify ports in:
   - `docker-compose.yml` (database ports)
   - `apps/backend/.env` (backend port)
   - `apps/frontend/.env.local` (API URLs)

### Missing Dependencies
```bash
# Clean install
rm -rf node_modules apps/*/node_modules
npm run install:all
```

## 📚 Next Steps

1. **Implement Real AI Integration**
   - Add OpenAI API integration
   - Configure custom AI providers
   - Implement streaming responses

2. **Enhance the IDE**
   - Add file system operations
   - Implement real-time collaboration
   - Add terminal integration

3. **Add RAG Features**
   - Document upload functionality
   - Vector embeddings generation
   - Semantic search implementation

4. **Deploy to Production**
   - Set up production environment variables
   - Configure SSL certificates
   - Set up monitoring and logging

## 🤝 Need Help?

- Check the main [README.md](README.md) for detailed documentation
- Review the [development blueprint](complete-shinmen-development-blueprint.md)
- Open an issue for bugs or feature requests

Happy coding with Shinmen! 🎉