# Sydney Shopping - Backend API

Production-ready Node.js + Express + TypeScript backend for the Sydney Shopping e-commerce platform.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Edit .env with your configuration
nano .env
```

### Development

```bash
# Start development server with hot reload
npm run dev

# Server will run at http://localhost:5000
```

### Production

```bash
# Build TypeScript
npm run build

# Start production server
npm start

# Or run both in one command
npm run prod
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── environment.ts   # Environment variables
│   │   ├── database.ts      # MongoDB connection
│   │   └── index.ts
│   ├── controllers/         # Request handlers
│   ├── models/              # MongoDB schemas (Mongoose)
│   ├── routes/              # API routes
│   ├── middleware/          # Express middleware
│   │   ├── errorHandler.ts  # Global error handling
│   │   ├── requestLogger.ts # Request logging
│   │   └── index.ts
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   │   ├── logger.ts        # Winston logger
│   │   ├── response.ts      # Response helpers
│   │   ├── helpers.ts       # Common helpers
│   │   └── index.ts
│   └── server.ts            # Express app entry point
├── dist/                    # Compiled JavaScript (build output)
├── logs/                    # Application logs
├── .env                     # Environment variables (local)
├── .env.example             # Environment template
├── .gitignore               # Git ignore rules
├── .eslintrc.json           # ESLint configuration
├── .prettierrc               # Prettier formatting
├── jest.config.js           # Jest testing config
├── package.json             # Dependencies & scripts
└── tsconfig.json            # TypeScript configuration
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start with hot reload

# Production
npm run build            # Compile TypeScript to JavaScript
npm start                # Run compiled app
npm run prod             # Build and run

# Code Quality
npm run lint             # Run ESLint
npm run format           # Format code with Prettier
npm run type-check       # Check TypeScript types

# Testing
npm test                 # Run all tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

## 🌍 Environment Variables

See `.env.example` for all available variables:

```env
# Server
NODE_ENV=development
PORT=5000
LOG_LEVEL=debug

# Database
MONGODB_URI=mongodb://localhost:27017/sydney-shopping

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

## 🔐 Security Features

- ✅ **Helmet.js** - HTTP headers security
- ✅ **CORS** - Cross-Origin Resource Sharing
- ✅ **Rate Limiting** - Prevent abuse
- ✅ **Password Hashing** - bcryptjs
- ✅ **JWT Authentication** - Token-based auth
- ✅ **Input Validation** - express-validator
- ✅ **Error Handling** - Global error handler
- ✅ **Environment Variables** - Sensitive data protection

## 📝 API Endpoints

### Health Check

- `GET /health` - Server status

### API Routes

- `GET /api/v1/` - API info
- `POST /api/v1/auth/register` - User registration (TODO)
- `POST /api/v1/auth/login` - User login (TODO)
- `GET /api/v1/products` - List products (TODO)
- `POST /api/v1/orders` - Create order (TODO)

## 🗄️ Database

### MongoDB Connection

The app connects to MongoDB using Mongoose. Configure in `.env`:

```env
MONGODB_URI=mongodb://localhost:27017/sydney-shopping
```

For MongoDB Atlas (cloud):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sydney-shopping
```

## 🚨 Error Handling

All errors are handled globally and return consistent JSON responses:

```json
{
  "success": false,
  "status": 400,
  "message": "Error message here"
}
```

## 📊 Logging

Application logs are stored in `logs/` directory:

- `error.log` - Errors only
- `all.log` - All logs

Console output in development shows colored logs.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on file changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 📦 Dependencies

### Runtime

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **cors** - Cross-Origin support
- **helmet** - Security headers
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting
- **winston** - Logging
- **dotenv** - Environment variables

### Development

- **typescript** - Type safety
- **ts-node-dev** - Development server
- **eslint** - Code linting
- **prettier** - Code formatting
- **jest** - Testing framework

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with compiled JavaScript.

### Run in Production

```bash
NODE_ENV=production npm start
```

### Docker (Optional)

Create a `Dockerfile` in backend root:

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
CMD ["npm", "start"]
```

## 🔗 Frontend Integration

The frontend (ecommerce-store) connects to this API:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- API Base: `http://localhost:5000/api/v1`

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [JWT Guide](https://jwt.io/introduction)

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Run `npm run lint` before committing
4. Add tests for new features
5. Keep `.env` secrets secure

## 📄 License

MIT

---

**Built with ❤️ for Sydney Shopping**
