# Backend API Documentation

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

This will install:

- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **TypeScript** - Type safety
- **Winston** - Logging
- **Helmet & CORS** - Security
- **bcryptjs & JWT** - Authentication
- **ESLint & Prettier** - Code quality

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- MongoDB URI/credentials
- JWT secret key
- API CORS origins
- Email (SMTP) settings
- Payment gateway keys (optional)

### 3. Start Development Server

```bash
npm run dev
```

Server runs at: `http://localhost:5000`

## Directory Structure

```
src/
├── config/          # Configuration modules
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/          # Mongoose schemas
├── routes/          # API routes
├── types/           # TypeScript definitions
├── utils/           # Helper functions
└── server.ts        # Express app
```

## Key Files Explained

### `.env`

Environment variables for local development (DO NOT commit)

### `.env.example`

Template for required environment variables (can be committed)

### `.gitignore`

Excludes node_modules, .env, logs, and build artifacts

### `tsconfig.json`

TypeScript configuration with path aliases (@/) for cleaner imports

### `package.json`

- Dependencies for runtime
- Dev dependencies for development/testing
- Custom npm scripts

### `src/server.ts`

Main Express application setup with:

- Middleware initialization
- Route setup
- Global error handling
- Server startup logic

## Available Routes (TODO)

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Products

- `GET /api/v1/products` - List all products
- `GET /api/v1/products/:id` - Get product details
- `POST /api/v1/products` - Create product (admin)
- `PUT /api/v1/products/:id` - Update product (admin)
- `DELETE /api/v1/products/:id` - Delete product (admin)

### Orders

- `GET /api/v1/orders` - Get user's orders
- `POST /api/v1/orders` - Create new order
- `GET /api/v1/orders/:id` - Get order details

## Development Workflow

### Code Quality

```bash
npm run lint              # Check for errors
npm run format            # Auto-format code
npm run type-check        # Verify TypeScript
```

### Testing

```bash
npm test                  # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Generate coverage report
```

### Build & Deploy

```bash
npm run build             # Compile to dist/
npm run prod              # Build & run
npm start                 # Run compiled app
```

## Security Features

✅ **Helmet.js** - Sets HTTP security headers
✅ **CORS** - Controls cross-origin requests
✅ **Rate Limiting** - Prevents request abuse
✅ **Password Hashing** - bcryptjs encryption
✅ **JWT Tokens** - Secure authentication
✅ **Input Validation** - express-validator
✅ **Environment Secrets** - Sensitive data protection
✅ **Error Handling** - Global error middleware

## API Response Format

### Success Response

```json
{
  "success": true,
  "status": 200,
  "message": "Data retrieved successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "status": 400,
  "message": "Error message here"
}
```

## Database Models

### User

- name, email, password
- phone, avatar
- role (user/admin)
- timestamps

### Product

- name, description, price
- category, images
- stock, rating
- seller, isActive
- timestamps

## Next Steps

1. ✅ Backend structure setup
2. 🔄 Implement authentication routes
3. 🔄 Create product routes
4. 🔄 Create order routes
5. 🔄 Add database models
6. 🔄 Implement controllers
7. 🔄 Add input validation
8. 🔄 Setup payment gateway integration
9. 🔄 Add comprehensive tests
10. 🔄 Deploy to production

## Troubleshooting

### Port already in use

Change PORT in `.env` or kill the process on that port

### MongoDB connection error

- Ensure MongoDB is running
- Check MONGODB_URI in `.env`
- Verify credentials if using Atlas

### Module not found errors

- Run `npm install` again
- Check TypeScript path aliases in `tsconfig.json`
- Rebuild with `npm run build`

## Resources

- [Express.js Docs](https://expressjs.com/)
- [MongoDB Docs](https://docs.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/)
- [TypeScript Docs](https://www.typescriptlang.org/)

---

**Questions?** Check individual file comments or README.md
