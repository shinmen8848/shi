# Shinmen Platform - Comprehensive Website Development Prompt

## Executive Summary

Develop **Shinmen**, a cutting-edge AI-driven development platform that adapts Open WebUI's sophisticated chat playground architecture while integrating API key management, AI agent systems, and web-based IDE capabilities. The platform should deliver a ChatGPT-style interface with enhanced developer-focused features, replacing Ollama dependencies with flexible custom API integrations supporting any OpenAI-compatible endpoint.

## Core Platform Vision

**Mission**: "To empower developers and teams with intelligent tools — from API keys to AI agents, IDEs, and real-time collaboration — making building with AI as seamless as building with code."

**Positioning**: Shinmen = Vercel for AI Development - One platform to chat, code, integrate, and deploy AI applications with enterprise-grade security and scalability.

## Technical Architecture Requirements

### Primary Technology Stack
- **Frontend**: Next.js 14 (App Router, React Server Components)
- **Backend**: Node.js with FastAPI-inspired async architecture
- **Authentication**: JWT (short-lived tokens) + Refresh tokens in Redis
- **Database**: PostgreSQL with pgvector extension for embeddings
- **Cache/Session**: Redis for real-time features, session management, and pub/sub
- **Real-time**: WebSockets for chat streaming and IDE collaboration
- **AI Integration**: Custom API providers (OpenAI-compatible endpoints)

### Core Architecture Pattern
```
[Next.js Frontend] 
      ↓
[Node.js API Gateway] ← JWT Auth ← Redis (session/cache)
      ↓
      ├── PostgreSQL (persistent storage)
      ├── AI Provider Service (Custom API endpoints)
      ├── IDE Service (Monaco Editor + collaboration)
      └── Function Engine (Custom plugins)
```

## Feature Requirements by Phase

### Phase 1: MVP (v1) - Core Chat Playground & API Foundation

#### 1. Advanced Chat Playground (Open WebUI Inspired)
**Core Features**:
- ChatGPT-style interface with responsive design
- True asynchronous chat with multitasking support
- Multiple model selection using dropdown interface
- Real-time message streaming with WebSocket connections
- Chat history with sidebar navigation (last 50 conversations)
- Pinned chats and favorite response management
- System prompts and advanced parameters configuration
- Chat completion notifications for non-active tabs

**Custom API Provider System**:
- Replace Ollama with flexible API configuration
- Support for custom base URL, API key, and model name
- Provider types: OpenAI, Anthropic, Custom endpoints
- Model capability detection (text, image, code, function_calling, vision)
- Connection validation and model discovery
- Secure credential storage with encryption

**Interactive Features**:
- Live code editing with artifacts support
- Markdown rendering with LaTeX support (MathJax)
- Text selection quick actions
- Voice input via Web Speech API
- Image generation proxy support

#### 2. Function System (Open WebUI Adapted)
**Function Types**:
- **Pipe Functions**: Custom model/agent implementations
- **Filter Functions**: Input/output processing middleware  
- **Action Functions**: Chat message action buttons

**Function Development Environment**:
- Code editor for function development
- Template system for different function types
- Testing environment with mock data
- Function marketplace for sharing

#### 3. RAG Integration (Document Processing)
**Document Management**:
- Support for PDF, DOCX, TXT, MD, URL content
- Automatic text extraction and chunking
- Vector embeddings generation and storage
- Semantic search with relevance scoring
- Citation tracking and source attribution

#### 4. API Key Management System
**Core Functionality**:
- Secure API key generation with hashing
- Usage tracking and analytics (Redis counters)
- Rate limiting enforcement per key
- Key scoping and permissions
- Revocation and rotation capabilities

#### 5. Web IDE Integration
**Basic Features**:
- Monaco Editor integration (VS Code engine)
- File system management
- Real-time preview pane
- Code execution in sandboxed environment
- Integration with chat for code explanations

### Phase 2: Advanced Features (v2) - Enterprise Scaling

#### Enhanced Collaboration
- **Channels**: Real-time collaborative spaces (Discord/Slack style)
- **Multi-user sessions**: Shared playground environments
- **Presence tracking**: See who's online and active
- **@mentions**: Team communication within chats

#### Advanced RAG & Search
- **Hybrid search**: Vector + keyword search combination
- **Re-ranking**: Cross-encoder for result optimization
- **Custom knowledge bases**: Enterprise document collections
- **Multi-modal RAG**: Support for images and code

#### Function Marketplace
- **Community functions**: Shared function library
- **Ratings and reviews**: Community-driven quality control
- **Versioning**: Function update management
- **Premium functions**: Monetization for developers

### Phase 3: Enterprise Edition (v3) - Full Platform

#### Enterprise Security
- **SSO Integration**: SAML, Okta, Azure AD support
- **RBAC**: Fine-grained role-based access control
- **Audit logging**: Comprehensive activity tracking
- **Compliance**: SOC2, GDPR, HIPAA readiness

#### Multi-tenant Architecture
- **Tenant isolation**: Secure data separation
- **Custom branding**: White-label deployment options
- **Resource limits**: Per-tenant usage controls
- **Custom domains**: Enterprise domain support

## Design System Requirements

### Visual Design Philosophy
**Theme**: Futuristic minimalism with developer-first UX
- **Color Scheme**: Dark mode primary, light mode optional, OLED dark variant
- **Typography**: Monospace for code, clean sans-serif for UI
- **Layout**: Grid-based with collapsible sidebars
- **Motion**: Subtle Framer Motion transitions

### UI Components (Open WebUI Inspired)
**Chat Interface**:
- Message bubbles with role indicators
- Streaming text animation
- Code syntax highlighting
- Artifact preview containers
- Model selector dropdown
- Parameter adjustment panels

**Navigation**:
- Collapsible sidebar with chat history
- Command palette (⌘+K) for quick actions
- Breadcrumb navigation
- Tab system for multiple contexts

**Interactive Elements**:
- Drag-and-drop file uploads
- Resizable panels
- Context menus
- Keyboard shortcuts
- Touch gestures for mobile

### Accessibility Requirements
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode
- Focus management
- ARIA labels and descriptions

## Performance & Optimization Requirements

### Frontend Performance
- **Bundle Optimization**: Code splitting and lazy loading
- **Caching Strategy**: Aggressive caching for static assets
- **Image Optimization**: Next.js Image component usage
- **Font Loading**: Optimal web font loading strategy

### Backend Performance
- **Response Times**: < 200ms for API calls
- **WebSocket Stability**: > 99% connection reliability
- **Concurrent Users**: Support 1000+ simultaneous users
- **Database Optimization**: Proper indexing and query optimization

### Real-time Features
- **Message Streaming**: Low-latency chat streaming
- **Collaboration Sync**: Real-time IDE synchronization
- **Presence Updates**: Live user status updates
- **Notification System**: Push notifications for important events

## Security Requirements

### Authentication & Authorization
- **JWT Implementation**: Short-lived access tokens (15 min)
- **Refresh Tokens**: Secure rotation in Redis
- **Session Management**: Secure session handling
- **Rate Limiting**: Per-user and per-endpoint limits

### Data Protection
- **Encryption**: At-rest and in-transit encryption
- **API Key Security**: Hashed storage, secure transmission
- **Input Validation**: Comprehensive sanitization
- **CSRF Protection**: Cross-site request forgery prevention

### Infrastructure Security
- **Network Security**: VPC, firewalls, security groups
- **Monitoring**: Security event logging and alerting
- **Vulnerability Management**: Regular security scans
- **Backup Strategy**: Encrypted, versioned backups

## Development Workflow Requirements

### Code Quality
- **TypeScript**: Full type safety throughout
- **ESLint/Prettier**: Consistent code formatting
- **Testing**: 85%+ test coverage requirement
- **Code Reviews**: Mandatory peer review process

### CI/CD Pipeline
- **Automated Testing**: Unit, integration, and E2E tests
- **Security Scanning**: Dependency and code vulnerability scans
- **Performance Testing**: Load testing for critical paths
- **Deployment**: Blue-green deployment strategy

### Monitoring & Observability
- **Application Monitoring**: Real-time performance metrics
- **Error Tracking**: Comprehensive error logging
- **User Analytics**: Usage patterns and feature adoption
- **Infrastructure Monitoring**: System health and resource usage

## Content Structure Guidelines

### Documentation Strategy
- **API Documentation**: Interactive Swagger/OpenAPI docs
- **User Guides**: Step-by-step tutorials with screenshots
- **Developer Resources**: Code examples and best practices
- **Video Tutorials**: Screen recordings for complex features

### Content Management
- **MDX Integration**: Markdown with React components
- **Version Control**: Git-based content management
- **Search Functionality**: Full-text search across all content
- **Internationalization**: Multi-language support preparation

## Implementation Best Practices

### Code Organization
```
src/
├── app/                    # Next.js App Router
│   ├── (chat)/            # Chat playground routes
│   ├── workspace/         # Workspace management
│   ├── ide/               # Web IDE interface
│   └── api/               # API endpoints
├── components/            # Reusable UI components
│   ├── chat/              # Chat-specific components
│   ├── workspace/         # Workspace components
│   └── ide/               # IDE components
├── lib/                   # Utility libraries
│   ├── providers/         # API provider clients
│   ├── websocket.ts       # WebSocket management
│   └── streaming.ts       # Chat streaming logic
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── styles/                # Global styles and themes
```

### Database Schema Design
- **Users**: Authentication and profile data
- **API Keys**: Secure key management with metadata
- **Chat Sessions**: Conversation history and context
- **Documents**: RAG document storage and embeddings
- **Functions**: Custom function definitions and code
- **Usage Metrics**: Analytics and billing data

### API Design Principles
- **RESTful Design**: Consistent REST API patterns
- **GraphQL Integration**: For complex data fetching
- **WebSocket Events**: Real-time communication protocol
- **Error Handling**: Standardized error response format
- **Versioning**: API version management strategy

## Success Metrics & KPIs

### Technical Metrics
- **Performance**: 95th percentile response times < 500ms
- **Reliability**: 99.9% uptime SLA
- **Security**: Zero critical security vulnerabilities
- **Scalability**: Linear scaling with user growth

### User Experience Metrics
- **Activation Rate**: Users completing first chat session
- **Retention**: 7-day, 30-day, and 90-day retention rates
- **Feature Adoption**: Usage of advanced features
- **User Satisfaction**: NPS score > 50

### Business Metrics
- **User Growth**: Monthly active user growth rate
- **Revenue**: Monthly recurring revenue growth
- **Conversion**: Free to paid conversion rate
- **Support**: Support ticket volume and resolution time

## Deployment & Infrastructure

### Development Environment
- **Docker Compose**: Local development setup
- **Hot Reloading**: Fast development iteration
- **Database Seeding**: Sample data for testing
- **Environment Variables**: Secure configuration management

### Production Deployment
- **Container Orchestration**: Kubernetes for scalability
- **Load Balancing**: Distributed traffic handling
- **CDN Integration**: Global content delivery
- **Monitoring Stack**: Comprehensive observability

### Scaling Strategy
- **Horizontal Scaling**: Auto-scaling based on demand
- **Database Scaling**: Read replicas and sharding
- **Cache Optimization**: Multi-layer caching strategy
- **Performance Monitoring**: Proactive performance management

## Quality Assurance

### Testing Strategy
- **Unit Tests**: Component and function testing
- **Integration Tests**: API and service integration
- **E2E Tests**: Complete user journey testing
- **Performance Tests**: Load and stress testing

### Code Quality Gates
- **Type Safety**: No TypeScript errors
- **Test Coverage**: Minimum 85% coverage
- **Security Scans**: No high-severity vulnerabilities
- **Performance Budgets**: Bundle size and runtime limits

This comprehensive prompt provides detailed guidance for creating a professional, scalable, and secure Shinmen platform that leverages Open WebUI's proven architecture while adding enterprise-focused features and maintaining exceptional developer experience.