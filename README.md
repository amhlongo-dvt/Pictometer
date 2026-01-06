# 📸 Pictometer

A modern, full-stack AI-powered image manipulation and generation application built with **Hono**, **Svelte**, and cutting-edge generative AI.

![Repobeats Analytics](https://repobeats.axiom.co/api/embed/bae9cd2945e7f92334d0a0f09b77979b16fde1f7.svg "Repobeats analytics image")

---

## ✨ Features

- **🔐 Secure Authentication** - User registration and login with JWT-based authentication
- **🖼️ Image Uploading** - Upload images with file validation and S3-compatible storage
- **✂️ Advanced Image Editing** - Resize, crop, rotate, apply filters, and more with Sharp
- **🤖 AI Image Generation** - Generate images from text prompts using Together AI
- **💬 Chat Interface** - Interactive chat for AI-powered image generation
- **⚡ Real-time Experience** - Smooth, reactive UI with instant feedback

---

## 🏗️ Architecture

```
Pictometer/
├── backend/         # Hono API server (Bun runtime)
│   ├── src/
│   │   ├── controllers/   # API route handlers (auth, chat, image)
│   │   ├── middlewares/   # Logging, rate limiting, JWT auth
│   │   ├── models/        # Data models
│   │   ├── integrations/  # External service integrations
│   │   └── storage/       # S3 storage utilities
│   └── prisma/            # Database schema and migrations
│
└── frontend/        # Svelte + Vite application
    └── src/
        ├── components/    # Reusable UI components
        ├── routes/        # Page components
        ├── services/      # API communication layer
        ├── stores/        # Svelte stores for state management
        └── lib/           # Utilities and component library
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **Hono** | Fast, lightweight web framework |
| **Bun** | High-performance JavaScript runtime |
| **Prisma** | Modern ORM for PostgreSQL |
| **Sharp** | Image processing and transformation |
| **Together AI** | AI-powered image generation |
| **Zod** | Schema validation |

### Frontend
| Technology | Purpose |
|------------|---------|
| **Svelte** | Reactive component framework |
| **Vite** | Fast build tool and dev server |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first styling |
| **Axios** | HTTP client with interceptors |
| **bits-ui** | Accessible component library |
| **lucide-svelte** | Icon library |

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (for backend)
- [Node.js](https://nodejs.org/) v18+ (for frontend)
- [PostgreSQL](https://www.postgresql.org/) database
- S3-compatible storage (AWS S3, MinIO, etc.)
- [Together AI](https://together.ai/) API key

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
bun install

# Set up environment variables
cp .env.test .env
# Edit .env with your database URL, S3 credentials, and API keys

# Run database migrations
bunx prisma migrate dev

# Start development server
bun run dev
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3000`.

---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/auth/register` | POST | Register a new user |
| `/auth/login` | POST | Authenticate user |
| `/image/upload` | POST | Upload an image |
| `/image/edit` | POST | Apply transformations to an image |
| `/image/generate` | POST | Generate image from text prompt |
| `/chat` | GET/POST | Manage chat sessions |
| `/chat/:id/message` | POST | Send message in chat |

---

## 🔧 Configuration

### Environment Variables

**Backend (`.env`):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/pictometer
S3_ENDPOINT=your-s3-endpoint
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
S3_BUCKET=your-bucket-name
TOGETHER_API_KEY=your-together-ai-key
JWT_SECRET=your-jwt-secret
```

---

## 🐳 Docker Support

```bash
# Start PostgreSQL with Docker Compose
cd backend
docker compose up -d
```

---

## 📁 Database Schema

The application uses the following data models:

- **User** - User accounts with authentication
- **Chat** - Chat sessions for AI interactions
- **Message** - Individual messages within chats
- **Image** - Uploaded and generated images with S3 references

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

- [Hono](https://hono.dev/) - Ultra-fast web framework
- [Svelte](https://svelte.dev/) - Cybernetically enhanced web apps
- [Together AI](https://together.ai/) - AI inference platform
- [Sharp](https://sharp.pixelplumbing.com/) - High-performance image processing
