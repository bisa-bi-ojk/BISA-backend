# Bisa Backend API Test Script (PowerShell)
# This script tests all authentication endpoints

$API_BASE = "http://localhost:3001"
$EMAIL = "test@example.com"
$PASSWORD = "password123"
$FIRST_NAME = "Test"
$LAST_NAME = "User"

Write-Host "🚀 Testing Bisa Backend API..." -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Test 1: Register a new user
Write-Host "📝 Testing user registration..." -ForegroundColor Yellow
$registerBody = @{
    email = $EMAIL
    password = $PASSWORD
    firstName = $FIRST_NAME
    lastName = $LAST_NAME
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$API_BASE/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Register Response: $($registerResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Register Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 2: Try to login without email verification (should fail)
Write-Host "🔐 Testing login without email verification (should fail)..." -ForegroundColor Yellow
$loginBody = @{
    email = $EMAIL
    password = $PASSWORD
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$API_BASE/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "Login Response: $($loginResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Login Error (Expected): $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 3: Request password reset
Write-Host "🔑 Testing forgot password..." -ForegroundColor Yellow
$forgotBody = @{
    email = $EMAIL
} | ConvertTo-Json

try {
    $forgotResponse = Invoke-RestMethod -Uri "$API_BASE/auth/forgot-password" -Method POST -Body $forgotBody -ContentType "application/json"
    Write-Host "Forgot Password Response: $($forgotResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Forgot Password Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""

# Test 4: Try to access protected route without token (should fail)
Write-Host "🛡️  Testing protected route without token (should fail)..." -ForegroundColor Yellow
try {
    $profileResponse = Invoke-RestMethod -Uri "$API_BASE/auth/profile" -Method GET
    Write-Host "Profile Response: $($profileResponse | ConvertTo-Json)" -ForegroundColor Green
} catch {
    Write-Host "Profile Error (Expected): $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "✅ API tests completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📧 To complete the flow:" -ForegroundColor Cyan
Write-Host "1. Check your email for verification link"
Write-Host "2. Click the verification link"
Write-Host "3. Then try logging in again"
Write-Host ""
Write-Host "🔍 Manual verification endpoint format:" -ForegroundColor Cyan
Write-Host "GET $API_BASE/auth/verify-email?token=YOUR_EMAIL_TOKEN"
