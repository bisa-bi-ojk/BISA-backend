# 🛣️ API Endpoints Documentation

## 📋 Overview

Dokumentasi lengkap semua endpoint API yang tersedia di backend **Bisa NestJS Authentication API**.

**Base URL:** `http://localhost:3001`

---

## 🏠 Root Endpoints

| Method | Endpoint | Description     | Auth Required |
| ------ | -------- | --------------- | ------------- |
| GET    | `/`      | Welcome message | No            |

### GET `/`

**Deskripsi:** Menampilkan pesan selamat datang dari aplikasi.

**Request:**

```bash
GET http://localhost:3001/
```

**Response:**

```json
"Hello World!"
```

---

## 🔐 Authentication Endpoints (`/auth`)

### 1. POST `/auth/register`

**Deskripsi:** Mendaftarkan pengguna baru dengan verifikasi email.

**Request Body:**

```json
{
  "fullName": "John Doe",
  "phone": "081234567890",
  "email": "john@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "citizen"
}
```

**Validation Rules:**

- `fullName`: Required, tidak boleh kosong
- `phone`: Required, tidak boleh kosong
- `email`: Format email valid
- `password`: Minimal 8 karakter, harus mengandung huruf besar, huruf kecil, dan angka/simbol
- `confirmPassword`: Required, tidak boleh kosong
- `role`: "admin" atau "citizen"

**Response Success (201):**

```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "fullName": "John Doe",
    "phone": "081234567890",
    "role": "citizen",
    "isEmailVerified": false,
    "createdAt": "2025-06-21T10:00:00.000Z"
  }
}
```

**Response Error (400):**

```json
{
  "statusCode": 400,
  "message": "Email already exists",
  "error": "Bad Request"
}
```

---

### 2. POST `/auth/login`

**Deskripsi:** Login pengguna dengan email dan password.

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Validation Rules:**

- `email`: Format email valid
- `password`: Minimal 6 karakter

**Response Success (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "fullName": "John Doe",
    "phone": "081234567890",
    "role": "citizen",
    "isEmailVerified": true
  }
}
```

**Response Error (401):**

```json
{
  "statusCode": 401,
  "message": "Please verify your email before logging in",
  "error": "Unauthorized"
}
```

---

### 3. GET `/auth/verify-email`

**Deskripsi:** Verifikasi email menggunakan token yang dikirim via email.

**Query Parameters:**

- `token` (required): Token verifikasi email

**Request:**

```bash
GET http://localhost:3001/auth/verify-email?token=abc123xyz789
```

**Response Success (200):**

```json
{
  "message": "Email verified successfully"
}
```

**Response Error (400):**

```json
{
  "statusCode": 400,
  "message": "Invalid or expired verification token",
  "error": "Bad Request"
}
```

---

### 4. GET `/auth/verify-otp`

**Deskripsi:** Verifikasi kode OTP untuk authentikasi dua faktor.

**Query Parameters:**

- `email` (required): Email pengguna
- `otp` (required): Kode OTP 6 digit

**Request:**

```bash
GET http://localhost:3001/auth/verify-otp?email=john@example.com&otp=123456
```

**Response Success (200):**

```json
{
  "message": "OTP verified successfully"
}
```

**Response Error (400):**

```json
{
  "statusCode": 400,
  "message": "Invalid or expired OTP code",
  "error": "Bad Request"
}
```

---

### 5. POST `/auth/forgot-password`

**Deskripsi:** Meminta reset password dengan mengirim email reset.

**Request Body:**

```json
{
  "email": "john@example.com"
}
```

**Validation Rules:**

- `email`: Format email valid

**Response Success (200):**

```json
{
  "message": "Password reset email sent successfully"
}
```

**Response Error (404):**

```json
{
  "statusCode": 404,
  "message": "User with this email does not exist",
  "error": "Not Found"
}
```

---

### 6. POST `/auth/reset-password`

**Deskripsi:** Reset password menggunakan token dari email.

**Request Body:**

```json
{
  "token": "reset_token_from_email",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

**Validation Rules:**

- `token`: Required, tidak boleh kosong
- `newPassword`: Minimal 8 karakter, harus mengandung huruf besar, huruf kecil, dan angka/simbol
- `confirmPassword`: Required, tidak boleh kosong

**Response Success (200):**

```json
{
  "message": "Password reset successfully"
}
```

**Response Error (400):**

```json
{
  "statusCode": 400,
  "message": "Invalid or expired reset token",
  "error": "Bad Request"
}
```

---

### 7. GET `/auth/profile` 🔒

**Deskripsi:** Mendapatkan profil pengguna yang sedang login (Protected Route).

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Request:**

```bash
GET http://localhost:3001/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Success (200):**

```json
{
  "id": 1,
  "email": "john@example.com",
  "fullName": "John Doe",
  "phone": "081234567890",
  "role": "citizen",
  "isEmailVerified": true,
  "createdAt": "2025-06-21T10:00:00.000Z",
  "updatedAt": "2025-06-21T10:00:00.000Z"
}
```

**Response Error (401):**

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

---

### 8. POST `/auth/logout` 🔒

**Deskripsi:** Logout pengguna (Protected Route).

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Request:**

```bash
POST http://localhost:3001/auth/logout
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response Success (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Note:** JWT bersifat stateless, sehingga logout ditangani di frontend dengan menghapus token. Backend hanya mengembalikan pesan konfirmasi.

---

## 🔒 Protected Routes

Endpoint yang memerlukan autentikasi menggunakan JWT token di header `Authorization: Bearer <token>`.

**Protected Endpoints:**

- `GET /auth/profile`
- `POST /auth/logout`

---

## 📨 Email Templates

Sistem mengirim email untuk berbagai keperluan:

1. **Email Verification** - Dikirim saat registrasi
2. **OTP Code** - Untuk verifikasi dua faktor
3. **Password Reset** - Untuk reset password
4. **Password Reset Success** - Konfirmasi password berhasil direset

---

## 🚨 Error Codes

| Status Code | Description                                          |
| ----------- | ---------------------------------------------------- |
| 200         | Success                                              |
| 201         | Created (Registration success)                       |
| 400         | Bad Request (Validation errors)                      |
| 401         | Unauthorized (Invalid credentials, unverified email) |
| 404         | Not Found (User not found)                           |
| 409         | Conflict (Email already exists)                      |
| 500         | Internal Server Error                                |

---

## 🧪 Testing Commands

### PowerShell

```powershell
# Test registration
$body = '{"fullName": "Test User", "phone": "081234567890", "email": "test@example.com", "password": "Password123!", "confirmPassword": "Password123!", "role": "citizen"}'
Invoke-RestMethod -Uri "http://localhost:3001/auth/register" -Method POST -Body $body -ContentType "application/json"

# Test login
$loginBody = '{"email": "test@example.com", "password": "Password123!"}'
Invoke-RestMethod -Uri "http://localhost:3001/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
```

### cURL

```bash
# Test registration
curl -X POST http://localhost:3001/auth/register \
-H "Content-Type: application/json" \
-d '{"fullName": "Test User", "phone": "081234567890", "email": "test@example.com", "password": "Password123!", "confirmPassword": "Password123!", "role": "citizen"}'

# Test login
curl -X POST http://localhost:3001/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "test@example.com", "password": "Password123!"}'
```

---

## 🔧 Environment Configuration

Pastikan variabel environment berikut sudah dikonfigurasi di file `.env`:

```env
# Server
APP_PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DATABASE_URL=postgresql://...

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
```

---

## 📚 Additional Notes

1. **Password Requirements**: Minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka/simbol
2. **Email Verification**: Wajib sebelum bisa login
3. **JWT Token**: Expires in 7 days (default)
4. **CORS**: Dikonfigurasi untuk frontend di `http://localhost:3000`
5. **Rate Limiting**: Belum diimplementasi (bisa ditambahkan untuk production)

---

**🚀 Server Status**: Running on `http://localhost:3001`
**📖 Documentation**: Complete API documentation
**🔄 Last Updated**: June 21, 2025
