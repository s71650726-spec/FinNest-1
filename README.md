# FinNest - Comprehensive Personal Finance Management App

## Project Overview

FinNest is a secure, scalable, multilingual personal finance management application designed to help users manage their expenses, investments, payments, and family financial collaboration seamlessly. The app integrates bank synchronization, UPI payments, AI-driven financial insights, gamification, and supports biometric and OAuth authentication.

---

## Features

- Secure authentication: Email/password, OAuth (Google, Apple), biometric login
- Bank account synchronization via Plaid and TrueLayer APIs
- UPI payments integration with PhonePe, Paytm, Google Pay, BHIM UPI
- AI financial insights: expense forecasts, saving suggestions, overspending warnings, personal goals
- Goal-based investments with AI recommended investment plans
- Gamification: XP points, badges, streaks, family leaderboard
- Manual and voice/photo-based expense entry
- Family collaboration: invites, shared bills, roles-based access control
- Multilingual support: English, Hindi, Telugu, Tamil, Malayalam, Bengali, Marathi
- Responsive UI with Apple-style design and glassmorphism effects
- Real-time updates via WebSocket using Socket.IO
- Comprehensive testing and error handling

---

## Tech Stack

### Backend

- Node.js with Express.js
- PostgreSQL with Sequelize ORM
- Passport.js for authentication strategies
- JWT for stateless auth tokens
- Socket.IO for real-time communication
- Multer for file uploads
- Redis for caching and session storage (optional)
- Docker for containerized deployment

### Frontend

- React.js with React Router
- TailwindCSS for styling
- Framer Motion for animations
- Axios for HTTP requests
- i18next for internationalization
- Socket.IO Client for real-time updates
- Jest and React Testing Library for testing

---

## Prerequisites

- Node.js v18 or higher
- PostgreSQL v13 or higher
- Redis (optional for caching and scaling WebSocket)
- Docker (optional, for containerized deployment)
- Yarn or npm

---

## Installation

### Backend Setup

1. Clone the repository and navigate to the backend directory:

        git clone https://github.com/yourorg/finnest.git
        cd finnest

2. Install backend dependencies:

        npm install

3. Copy environment variables template and configure:

        cp .env.example .env

   Edit `.env` to provide your database URL, OAuth credentials, API keys, and JWT secrets.

4. Initialize the database:

   Ensure PostgreSQL is running and the database specified in `DATABASE_URL` exists.

5. Start the backend server:

        npm run dev

   The backend will run on port 4000 by default.

### Frontend Setup

1. Navigate to the frontend directory:

        cd frontend

2. Install frontend dependencies:

        npm install

3. Copy frontend environment variables template and configure:

        cp .env.example .env

4. Start the frontend development server:

        npm start

   The frontend runs on port 3000 by default and proxies API requests to backend.

---

## Configuration

### Environment Variables

The `.env` file for backend requires:

- `PORT`: Server port (default 4000)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- OAuth credentials for Google and Apple
- API keys and secrets for Plaid, TrueLayer, UPI providers, voice recognition
- `REDIS_URL`: Redis connection string (optional)
- `NODE_ENV`: environment (development or production)

The frontend `.env` requires:

- `REACT_APP_API_BASE_URL`: Backend API base URL
- `REACT_APP_OAUTH_CLIENT_ID`: OAuth client id
- `REACT_APP_UPI_API_KEY`: UPI API key
- `REACT_APP_VOICE_API_KEY`: Voice recognition API key

---

## Running the Application

### Development

- Start backend server:

      npm run dev

- Start frontend server:

      cd frontend
      npm start

### Production

- Build frontend:

      cd frontend
      npm run build

- Serve backend and frontend using Docker or your preferred hosting solution.

---

## Deployment

### Frontend

- Deploy the `frontend/build` folder to Vercel or any static hosting.
- Configure environment variables in hosting platform.

### Backend

- Deploy backend with Docker to Render, Fly.io, or any Node.js hosting platform.
- Configure environment variables securely.
- Use Redis for WebSocket scaling if needed.

---

## API Usage

Refer to [docs/API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md) for complete API reference.

---

## Authentication Flow

- Users can login with email/password, Google OAuth, Apple OAuth, or biometrics.
- JWT tokens are issued upon successful authentication.
- Tokens expire in 6 hours; refresh tokens available.
- Secured routes require JWT token in `Authorization` header.

---

## Database Schema

Detailed schema documentation available at [docs/DB_SCHEMA.md](./docs/DB_SCHEMA.md).

---

## Testing

- Backend tests use Jest and Supertest.
- Frontend tests use Jest and React Testing Library.
- Run backend tests:

      npm test

- Run frontend tests:

      cd frontend
      npm test

---

## Troubleshooting

- Ensure all environment variables are set correctly.
- Check PostgreSQL and Redis connectivity.
- Verify OAuth credentials are valid and callback URLs configured.
- Check logs for detailed error messages.
- For WebSocket issues, verify tokens and CORS configuration.

---

## Project Structure

- `src/`: Backend source code (models, routes, middleware, utils, socket)
- `frontend/`: React frontend source code (components, hooks, styles, i18n)
- `docs/`: Documentation files
- `tests/`: Backend and frontend test suites
- `Dockerfile.backend`: Backend Docker configuration
- `Dockerfile.frontend`: Frontend Docker configuration

---

## Contact

For support, contact the FinNest development team at support@finnest.app
