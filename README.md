# Shinmen - AI-Native Developer Cloud Platform

A comprehensive AI-driven development platform that combines the strengths of Vercel (Developer Experience), Supabase (Infrastructure), and ChatGPT (LLM Chat) into a unified ecosystem for AI-native development.

## 🚀 Features

### Phase 1 (MVP) - Implemented
- ✅ **User Authentication**: JWT-based auth with refresh tokens
- ✅ **API Key Management**: Secure key generation and usage tracking
- ✅ **Chat Playground**: ChatGPT-style interface with custom AI providers
- ✅ **Web IDE**: Monaco Editor with syntax highlighting
- ✅ **Real-time Features**: WebSocket support for chat and collaboration
- ✅ **Dark Theme UI**: Modern glassmorphism design

### Phase 2 (Planned)
- 🔄 **Multi-Agent Chat**: Support for multiple AI providers simultaneously
- 🔄 **RAG Integration**: Document upload and vector search
- 🔄 **Advanced IDE**: Real-time collaboration and AI assistance
- 🔄 **Function System**: Custom plugins and extensions

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js 14    │    │   Node.js API   │    │  PostgreSQL +   │
│   Frontend      │◄──►│   Backend       │◄──►│  pgvector       │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │              ┌─────────────────┐              │
         └──────────────►│     Redis       │◄─────────────┘
                        │   (Sessions)    │
                        └─────────────────┘
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, TypeScript, JWT, WebSockets
- **Database**: PostgreSQL with pgvector extension
- **Cache**: Redis for sessions and real-time features
- **Editor**: Monaco Editor (VS Code engine)
- **State**: Zustand for client state management

## 📦 Installation

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shi
   ```

2. **Start the database services**
   ```bash
   docker-compose up -d
   ```

3. **Install dependencies**
   ```bash
   npm run install:all
   ```

4. **Set up the database**
   ```bash
   cd apps/backend
   npm run db:migrate
   ```

5. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

   This will start:
   - Backend API server on http://localhost:3001
   - Frontend application on http://localhost:3000

## 🔧 Development

### Backend Development
```bash
cd apps/backend
npm run dev          # Start development server
npm run build        # Build for production
npm run db:migrate   # Run database migrations
```

### Frontend Development
```bash
cd apps/frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run lint         # Run ESLint
```

## 📁 Project Structure

```
shi/
├── apps/
│   ├── backend/              # Node.js API server
│   │   ├── src/
│   │   │   ├── config/       # Configuration files
│   │   │   ├── database/     # Database connection and migrations
│   │   │   ├── middleware/   # Express middleware
│   │   │   ├── routes/       # API routes
│   │   │   ├── services/     # Business logic
│   │   │   ├── types/        # TypeScript types
│   │   │   ├── utils/        # Utility functions
│   │   │   └── websocket/    # WebSocket handlers
│   │   └── package.json
│   └── frontend/             # Next.js application
│       ├── src/
│       │   ├── app/          # Next.js 14 app directory
│       │   ├── components/   # React components
│       │   ├── hooks/        # Custom React hooks
│       │   ├── lib/          # Utility libraries
│       │   ├── store/        # Zustand stores
│       │   └── types/        # TypeScript types
│       └── package.json
├── docs/                     # Documentation
├── docker-compose.yml        # Database services
└── package.json             # Root package.json
```

## 🔐 Environment Variables

### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://shinmen_user:shinmen_password@localhost:5432/shinmen
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shinmen
DB_USER=shinmen_user
DB_PASSWORD=shinmen_password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=ws://localhost:3001
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Docker Deployment
```bash
# Build and start all services
docker-compose -f docker-compose.prod.yml up -d
```

## 🧪 Testing

```bash
# Run backend tests
cd apps/backend && npm test

# Run frontend tests
cd apps/frontend && npm test
```

## 📖 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### API Key Endpoints
- `GET /api/keys` - List user's API keys
- `POST /api/keys` - Create new API key
- `PUT /api/keys/:id` - Update API key
- `DELETE /api/keys/:id` - Delete API key

### Chat Endpoints
- `GET /api/chat/sessions` - List chat sessions
- `POST /api/chat/sessions` - Create chat session
- `GET /api/chat/sessions/:id` - Get chat session with messages
- `PUT /api/chat/sessions/:id` - Update chat session
- `DELETE /api/chat/sessions/:id` - Delete chat session
- `POST /api/chat/sessions/:id/messages` - Add message to session

### IDE Endpoints
- `GET /api/ide/projects` - List IDE projects
- `POST /api/ide/projects` - Create IDE project
- `GET /api/ide/projects/:id` - Get IDE project
- `PUT /api/ide/projects/:id` - Update IDE project
- `DELETE /api/ide/projects/:id` - Delete IDE project

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the Open WebUI project for chat interface design
- Monaco Editor for the web-based IDE experience
- Next.js team for the excellent React framework
- PostgreSQL and pgvector for vector database capabilities

---

**Shinmen** - Building the future of AI-native development 🚀