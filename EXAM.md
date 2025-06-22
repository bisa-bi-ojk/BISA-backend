# 📝 BISA Backend API Testing Guide (EXAM.md)

Panduan lengkap untuk menguji semua endpoint API BISA Backend menggunakan Postman atau tools testing lainnya.

**Base URL:** `http://localhost:3001`

---

## 🚀 Setup & Prerequisites

### 1. Persiapan Environment

- ✅ Pastikan server berjalan di `http://localhost:3001`
- ✅ Database terhubung dan migrasi sudah dijalankan
- ✅ Email service dikonfigurasi dengan benar (Gmail SMTP)
- ✅ Postman atau REST client lainnya sudah terinstall

### 2. Environment Variables di Postman

Buat environment baru di Postman dengan variables:

```
API_BASE = http://localhost:3001
JWT_TOKEN = (akan diisi setelah login berhasil)
```

---

## 🧪 Complete Testing Flow (Step by Step)

### STEP 1: User Registration

**Method:** `POST`  
**Endpoint:** `{{API_BASE}}/auth/register`

**Body (raw, JSON):**

```json
{
  "fullName": "Anthony Feriyanto",
  "phone": "081234567890",
  "email": "anthonyef09@gmail.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "role": "citizen"
}
```

**Expected Response (201):**

```json
{
  "message": "User registered successfully. Please check your email for verification.",
  "user": {
    "id": 1,
    "fullName": "Anthony Feriyanto",
    "phone": "081234567890",
    "email": "anthonyef09@gmail.com",
    "emailVerified": false,
    "otpCode": "123456",
    "otpExpires": "2025-06-22T14:24:13.526Z",
    "role": "citizen",
    "createdAt": "2025-06-22T13:58:49.150Z"
  }
}
```

**Notes:**

- ✅ Simpan `otpCode` dari response untuk step berikutnya
- ✅ Role bisa `"citizen"` atau `"admin"`
- ✅ Password harus minimal 8 karakter dengan huruf besar, kecil, dan angka/simbol
- ✅ Email akan dikirim berisi OTP code

---

### STEP 2: Email/OTP Verification

**Method:** `GET`  
**Endpoint:** `{{API_BASE}}/auth/verify-otp`

**Query Parameters:**

- `email`: `anthonyef09@gmail.com`
- `otp`: `123456` (gunakan OTP dari response registrasi)

**Full URL Example:**

```
http://localhost:3001/auth/verify-otp?email=anthonyef09@gmail.com&otp=123456
```

**Expected Response (200):**

```json
{
  "message": "OTP verified successfully"
}
```

**Notes:**

- ✅ OTP berlaku selama 10 menit
- ✅ Setelah verifikasi berhasil, user bisa login
- ✅ Email konfirmasi akan dikirim

---

### STEP 3: User Login

**Method:** `POST`  
**Endpoint:** `{{API_BASE}}/auth/login`

**Body (raw, JSON):**

```json
{
  "email": "anthonyef09@gmail.com",
  "password": "Password123!"
}
```

**Expected Response (200):**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "fullName": "Anthony Feriyanto",
    "phone": "081234567890",
    "email": "anthonyef09@gmail.com",
    "emailVerified": true,
    "role": "citizen",
    "createdAt": "2025-06-22T13:58:49.150Z"
  }
}
```

**Notes:**

- ✅ Simpan `access_token` untuk endpoint yang memerlukan auth
- ✅ Di Postman, set JWT_TOKEN environment variable dengan `access_token`
- ✅ Login hanya berhasil jika email sudah diverifikasi

---

### STEP 4: Get User Profile (Protected)

**Method:** `GET`  
**Endpoint:** `{{API_BASE}}/auth/profile`

**Headers:**

```
Authorization: Bearer {{JWT_TOKEN}}
```

**Expected Response (200):**

```json
{
  "id": 1,
  "fullName": "Anthony Feriyanto",
  "phone": "081234567890",
  "email": "anthonyef09@gmail.com",
  "emailVerified": true,
  "role": "citizen",
  "createdAt": "2025-06-22T13:58:49.150Z",
  "updatedAt": "2025-06-22T13:58:49.150Z"
}
```

**Notes:**

- ✅ Endpoint ini memerlukan valid JWT token
- ✅ Token dikirim via Authorization header

---

### STEP 5: Forgot Password

**Method:** `POST`  
**Endpoint:** `{{API_BASE}}/auth/forgot-password`

**Body (raw, JSON):**

```json
{
  "email": "anthonyef09@gmail.com"
}
```

**Expected Response (200):**

```json
{
  "message": "If the email exists, a password reset link has been sent"
}
```

**Notes:**

- ✅ Email akan dikirim berisi link reset password
- ✅ Response selalu sama untuk keamanan (tidak bocorkan info email exist/tidak)

---

### STEP 6: Reset Password

**Method:** `POST`  
**Endpoint:** `{{API_BASE}}/auth/reset-password`

**Body (raw, JSON):**

```json
{
  "token": "RESET_TOKEN_FROM_EMAIL",
  "newPassword": "NewPassword456!",
  "confirmPassword": "NewPassword456!"
}
```

**Expected Response (200):**

```json
{
  "message": "Password reset successfully"
}
```

**Notes:**

- ✅ Ganti `RESET_TOKEN_FROM_EMAIL` dengan token dari email
- ✅ `newPassword` dan `confirmPassword` harus sama
- ✅ Password harus memenuhi kriteria keamanan

---

### STEP 7: Logout (Protected)

**Method:** `POST`  
**Endpoint:** `{{API_BASE}}/auth/logout`

**Headers:**

```
Authorization: Bearer {{JWT_TOKEN}}
```

**Expected Response (200):**

```json
{
  "message": "Logged out successfully"
}
```

**Notes:**

- ✅ JWT bersifat stateless, logout ditangani di frontend
- ✅ Hapus token dari storage/environment variable

---

## 🔍 Additional Test Cases

### Test Email Verification Alternative

**Method:** `GET`  
**Endpoint:** `{{API_BASE}}/auth/verify-email`

**Query Parameters:**

- `token`: `EMAIL_VERIFICATION_TOKEN`

**Full URL Example:**

```
http://localhost:3001/auth/verify-email?token=EMAIL_VERIFICATION_TOKEN
```

**Notes:**

- ✅ Alternative untuk admin yang mendapat email verification token
- ✅ Token bisa didapat dari email atau database

---

## 🚨 Error Testing Scenarios

### 1. Login Tanpa Verifikasi Email

```json
{
  "email": "unverified@example.com",
  "password": "Password123!"
}
```

**Expected:** `401 Unauthorized - Please verify your email`

### 2. Login dengan Kredensial Salah

```json
{
  "email": "anthonyef09@gmail.com",
  "password": "WrongPassword"
}
```

**Expected:** `401 Unauthorized - Invalid credentials`

### 3. Registrasi dengan Email yang Sudah Ada

```json
{
  "fullName": "Duplicate User",
  "email": "anthonyef09@gmail.com",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

**Expected:** `409 Conflict - Email already registered`

### 4. Access Protected Route Tanpa Token

**Request:** `GET /auth/profile` (tanpa Authorization header)  
**Expected:** `401 Unauthorized`

---

## 📋 Testing Checklist

### Registration Flow

- [ ] ✅ User dapat register dengan data valid
- [ ] ✅ OTP code diterima di response
- [ ] ✅ Email OTP dikirim ke inbox
- [ ] ✅ OTP verification berhasil
- [ ] ✅ Email confirmation dikirim

### Login Flow

- [ ] ✅ Login berhasil setelah email verified
- [ ] ✅ JWT token diterima
- [ ] ✅ Login gagal jika email belum verified
- [ ] ✅ Login gagal dengan kredensial salah

### Protected Routes

- [ ] ✅ Profile accessible dengan valid token
- [ ] ✅ Profile tidak accessible tanpa token
- [ ] ✅ Logout berhasil dengan valid token

### Password Reset

- [ ] ✅ Forgot password mengirim email
- [ ] ✅ Reset password dengan token valid berhasil
- [ ] ✅ Reset password dengan token invalid gagal

---

## 🔧 Environment Setup Examples

### Postman Environment Variables

```json
{
  "API_BASE": "http://localhost:3001",
  "JWT_TOKEN": "",
  "TEST_EMAIL": "anthonyef09@gmail.com",
  "TEST_PASSWORD": "Password123!"
}
```

### PowerShell Testing Script

```powershell
$API_BASE = "http://localhost:3001"
$EMAIL = "anthonyef09@gmail.com"
$PASSWORD = "Password123!"

# Test Registration
$registerBody = @{
    fullName = "Anthony Feriyanto"
    phone = "081234567890"
    email = $EMAIL
    password = $PASSWORD
    confirmPassword = $PASSWORD
    role = "citizen"
} | ConvertTo-Json

Invoke-RestMethod -Uri "$API_BASE/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
```

---

## 📚 Useful Tips

1. **Postman Collections**: Buat collection dan folder untuk organize requests
2. **Environment Variables**: Gunakan variables untuk reusable values
3. **Pre-request Scripts**: Auto-generate test data jika diperlukan
4. **Tests Tab**: Tambahkan assertions untuk automated testing
5. **Console Logs**: Check Postman console untuk debug

---

**🚀 Happy Testing!**

Dokumentasi ini akan membantu Anda melakukan testing lengkap terhadap semua endpoint API BISA Backend. Ikuti step-by-step untuk memastikan semua functionality bekerja dengan benar.
**Headers:**

- `Authorization`: `Bearer {{JWT_TOKEN}}`

**Catatan:**

- `{{JWT_TOKEN}}` adalah `access_token` yang didapat setelah berhasil login. Di Postman, Anda bisa menyimpannya di _environment variable_ setelah request login berhasil.

---
