# Bisa Backend - NestJS Authentication API

## Overview

This is a complete backend application built with **NestJS** that provides authentication features including:
- User registration with email verification
- User login/logout
- Password reset and forgot password functionality
- JWT-based authentication
- Email notifications for verification and password reset

## Technology Stack

- **Framework**: NestJS (Node.js framework)
- **Database**: PostgreSQL (with Neon cloud database)
- **ORM**: Drizzle ORM
- **Authentication**: JWT with Passport.js
- **Email**: Nodemailer
- **Validation**: class-validator & class-transformer
- **Password Hashing**: bcryptjs

## Features

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register a new user | No |
| POST | `/auth/login` | Login user | No |
| GET | `/auth/verify-email` | Verify email with token | No |
| POST | `/auth/forgot-password` | Request password reset | No |
| POST | `/auth/reset-password` | Reset password with token | No |
| GET | `/auth/profile` | Get user profile | Yes |
| POST | `/auth/logout` | Logout user | Yes |

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd "c:\Users\Anthony Feriyanto\Documents\PBP\bisa\bisa-backend"
npm install
```

### 2. Environment Configuration

The `.env` file is already configured with the following variables:

```env
# Database Configuration
DATABASE_URL=postgresql://bisa_owner:npg_hQnL17yJdgCP@ep-quiet-glade-a1n283kt-pooler.ap-southeast-1.aws.neon.tech/bisa?sslmode=require

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration (Gmail SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=anthonyef09@gmail.com

# Application Configuration
APP_PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 3. Email Setup (Important!)

To enable email verification and password reset functionality:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a password for "Mail"
3. **Update the .env file**:
   - Replace `EMAIL_USER` with your Gmail address
   - Replace `EMAIL_PASS` with the generated app password

### 4. Database Migration

The database is already set up and migrated. If you need to regenerate:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 5. Start the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on **http://localhost:3001**

## API Usage Examples

### 1. Register a User

```bash
curl -X POST http://localhost:3001/auth/register \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}'
```

**Response:**
```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": false,
    "createdAt": "2025-06-18T16:00:00.000Z"
  }
}
```

### 2. Verify Email

Check your email for the verification link, or use:

```bash
curl "http://localhost:3001/auth/verify-email?token=EMAIL_VERIFICATION_TOKEN"
```

### 3. Login

```bash
curl -X POST http://localhost:3001/auth/login \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com",
  "password": "password123"
}'
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isEmailVerified": true
  }
}
```

### 4. Get Profile (Protected Route)

```bash
curl -X GET http://localhost:3001/auth/profile \
-H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Forgot Password

```bash
curl -X POST http://localhost:3001/auth/forgot-password \
-H "Content-Type: application/json" \
-d '{
  "email": "user@example.com"
}'
```

### 6. Reset Password

```bash
curl -X POST http://localhost:3001/auth/reset-password \
-H "Content-Type: application/json" \
-d '{
  "token": "RESET_TOKEN_FROM_EMAIL",
  "newPassword": "newPassword123"
}'
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  is_email_verified BOOLEAN DEFAULT FALSE NOT NULL,
  email_verification_token VARCHAR(255),
  password_reset_token VARCHAR(255),
  password_reset_expires TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcryptjs with 12 rounds
2. **JWT Authentication**: Secure token-based authentication
3. **Email Verification**: Users must verify their email before login
4. **Password Reset Tokens**: Secure tokens that expire in 1 hour
5. **Input Validation**: All inputs are validated using class-validator
6. **CORS Configuration**: Properly configured for frontend integration

## Frontend Integration

The API is configured to work with a frontend running on `http://localhost:3000`. 

**Email Links Format:**
- Email verification: `http://localhost:3000/verify-email?token={token}`
- Password reset: `http://localhost:3000/reset-password?token={token}`

## Error Handling

The API returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

Common HTTP status codes:
- `200`: Success
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid credentials, unverified email)
- `409`: Conflict (email already exists)

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run start:dev

# Build for production
npm run build

# Run production server
npm run start:prod

# Lint code
npm run lint

# Format code
npm run format

# Run tests
npm run test

# Generate database migrations
npx drizzle-kit generate

# Run database migrations
npx drizzle-kit migrate
```

## Project Structure

```
src/
├── auth/                   # Authentication module
│   ├── dto/               # Data Transfer Objects
│   ├── guards/            # Route guards
│   ├── strategies/        # Passport strategies
│   ├── auth.controller.ts # Auth endpoints
│   ├── auth.service.ts    # Auth business logic
│   └── auth.module.ts     # Auth module
├── database/              # Database configuration
│   ├── migrations/        # Database migrations
│   ├── database.module.ts # Database connection
│   └── schema.ts          # Database schema
├── email/                 # Email service
│   ├── email.service.ts   # Email functionality
│   └── email.module.ts    # Email module
├── users/                 # User management
│   ├── dto/               # User DTOs
│   ├── users.service.ts   # User business logic
│   └── users.module.ts    # User module
├── app.module.ts          # Main application module
└── main.ts                # Application entry point
```

## Support

For any issues or questions, please check the logs and ensure:
1. Database connection is working
2. Email configuration is correct
3. All environment variables are set
4. Port 3001 is available

## Production Deployment

For production deployment:
1. Set `NODE_ENV=production`
2. Use a strong `JWT_SECRET`
3. Configure proper CORS origins
4. Set up SSL/HTTPS
5. Use production-grade database credentials
6. Configure proper email service (SendGrid, AWS SES, etc.)
