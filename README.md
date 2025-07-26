<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

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

| Method | Endpoint                | Description               | Auth Required |
| ------ | ----------------------- | ------------------------- | ------------- |
| POST   | `/auth/register`        | Register a new user       | No            |
| POST   | `/auth/login`           | Login user                | No            |
| GET    | `/auth/verify-email`    | Verify email with token   | No            |
| POST   | `/auth/forgot-password` | Request password reset    | No            |
| POST   | `/auth/reset-password`  | Reset password with token | No            |
| GET    | `/auth/profile`         | Get user profile          | Yes           |
| POST   | `/auth/logout`          | Logout user               | Yes           |

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
DATABASE_URL= database_url

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

# 🚀 Complete NestJS Authentication Backend Tutorial

## 🎯 What We've Built

A **complete authentication backend** with:

- ✅ User Registration with Email Verification
- ✅ Login/Logout with JWT Authentication
- ✅ Password Reset & Forgot Password
- ✅ Protected Routes with Guards
- ✅ Database Integration with Drizzle ORM
- ✅ Email Notifications with Nodemailer

## 📋 Prerequisites

- Node.js (v18+)
- PostgreSQL Database (using Neon cloud)
- Gmail account for email functionality

## 🛠️ Quick Start

### 1. Project Setup (Already Done)

```bash
# Navigate to project
cd "c:\Users\Anthony Feriyanto\Documents\PBP\bisa\bisa-backend"

# Install dependencies (already done)
npm install

# Start development server
npm run start:dev
```

### 2. Database Setup (Already Done)

- ✅ PostgreSQL database on Neon cloud
- ✅ Database schema created and migrated
- ✅ Connection string configured in `.env`

### 3. Environment Configuration

Edit `.env` file for email functionality:

```env
# Update these with your Gmail credentials
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-gmail-app-password

# Other configs (already set)
DATABASE_URL=postgresql://bisa_owner:npg_hQnL17yJdgCP@ep-quiet-glade-a1n283kt-pooler.ap-southeast-1.aws.neon.tech/bisa?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-here
APP_PORT=3001
FRONTEND_URL=http://localhost:3000
```

### 4. Gmail Setup for Email Verification

1. **Enable 2-Factor Authentication** on Gmail
2. **Generate App Password**:
   - Google Account → Security → 2-Step Verification → App passwords
   - Create password for "Mail"
3. **Update .env**:
   - Set `EMAIL_USER` to your Gmail
   - Set `EMAIL_PASS` to the app password

## 🌐 API Endpoints

| Method | Endpoint                       | Description                  | Status     |
| ------ | ------------------------------ | ---------------------------- | ---------- |
| POST   | `/auth/register`               | Register new user            | ✅ Working |
| POST   | `/auth/login`                  | User login                   | ✅ Working |
| GET    | `/auth/verify-email?token=...` | Verify email                 | ✅ Working |
| POST   | `/auth/forgot-password`        | Request password reset       | ✅ Working |
| POST   | `/auth/reset-password`         | Reset password               | ✅ Working |
| GET    | `/auth/profile`                | Get user profile (protected) | ✅ Working |
| POST   | `/auth/logout`                 | Logout user                  | ✅ Working |

## 🧪 Testing the API

### Option 1: PowerShell Script

```powershell
# Run the test script
.\test-api.ps1
```

### Option 2: Manual Testing

```powershell
# Register a user
$body = '{"email": "test@example.com", "password": "password123", "firstName": "Test", "lastName": "User"}'
Invoke-RestMethod -Uri "http://localhost:3001/auth/register" -Method POST -Body $body -ContentType "application/json"

# Login (will fail until email verified)
$loginBody = '{"email": "test@example.com", "password": "password123"}'
Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
```

## 🏗️ Project Architecture

```
src/
├── auth/                   # 🔐 Authentication Module
│   ├── dto/               # Request/Response objects
│   ├── guards/            # Route protection
│   ├── strategies/        # JWT strategy
│   └── auth.service.ts    # Business logic
├── database/              # 🗄️ Database Module
│   ├── migrations/        # Database migrations
│   └── schema.ts          # Database schema
├── email/                 # 📧 Email Module
│   └── email.service.ts   # Email functionality
├── users/                 # 👥 User Module
│   └── users.service.ts   # User management
└── main.ts                # 🚀 Application entry
```

## 🔑 Key Features Implemented

### 1. User Registration Flow

```
User registers → Email sent → User clicks link → Email verified → Can login
```

### 2. Authentication Flow

```
Login → JWT token issued → Use token for protected routes
```

### 3. Password Reset Flow

```
Forgot password → Email sent → Click link → Reset password → Can login
```

### 4. Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT tokens for stateless authentication
- ✅ Email verification required
- ✅ Secure password reset tokens
- ✅ Input validation
- ✅ CORS configuration

## 📝 Database Schema

```sql
Users Table:
- id (Primary Key)
- email (Unique, Required)
- password (Hashed)
- firstName, lastName
- isEmailVerified (Boolean)
- emailVerificationToken
- passwordResetToken
- passwordResetExpires
- createdAt, updatedAt
```

## 🔧 Technologies Used

- **Framework**: NestJS
- **Database**: PostgreSQL (Neon cloud)
- **ORM**: Drizzle ORM
- **Authentication**: Passport.js + JWT
- **Email**: Nodemailer (Gmail SMTP)
- **Validation**: class-validator
- **Security**: bcryptjs for hashing

## 🚀 Current Status

✅ **Application is running successfully on http://localhost:3001**

✅ **All endpoints are functional**

⚠️ **Email functionality requires Gmail configuration**

## 📋 Next Steps

1. **Configure Gmail credentials** for email functionality
2. **Test all endpoints** using the provided scripts
3. **Build frontend** to consume the API
4. **Deploy to production** when ready

## 🔍 Troubleshooting

### Common Issues:

1. **Port 3001 in use**: Change `APP_PORT` in `.env`
2. **Database connection error**: Check `DATABASE_URL`
3. **Email not sending**: Configure Gmail app password
4. **JWT errors**: Set proper `JWT_SECRET`

### Logs Location:

Check terminal output for real-time logs and error messages.

## 📚 Additional Resources

- [NestJS Documentation](https://nestjs.com/)
- [Drizzle ORM Docs](https://orm.drizzle.team/)
- [JWT.io](https://jwt.io/) for token debugging
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)

---
