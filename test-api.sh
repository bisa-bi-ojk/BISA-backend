#!/bin/bash

# Bisa Backend API Test Script
# This script tests all authentication endpoints

API_BASE="http://localhost:3001"
EMAIL="test@example.com"
PASSWORD="password123"
FIRST_NAME="Test"
LAST_NAME="User"

echo "🚀 Testing Bisa Backend API..."
echo "================================"

# Test 1: Register a new user
echo "📝 Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST $API_BASE/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\",
    \"firstName\": \"$FIRST_NAME\",
    \"lastName\": \"$LAST_NAME\"
  }")

echo "Register Response: $REGISTER_RESPONSE"
echo ""

# Test 2: Try to login without email verification (should fail)
echo "🔐 Testing login without email verification (should fail)..."
LOGIN_RESPONSE=$(curl -s -X POST $API_BASE/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"$PASSWORD\"
  }")

echo "Login Response (should fail): $LOGIN_RESPONSE"
echo ""

# Test 3: Request password reset
echo "🔑 Testing forgot password..."
FORGOT_RESPONSE=$(curl -s -X POST $API_BASE/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\"
  }")

echo "Forgot Password Response: $FORGOT_RESPONSE"
echo ""

# Test 4: Try to access protected route without token (should fail)
echo "🛡️  Testing protected route without token (should fail)..."
PROFILE_RESPONSE=$(curl -s -X GET $API_BASE/auth/profile)

echo "Profile Response (should fail): $PROFILE_RESPONSE"
echo ""

echo "✅ API tests completed!"
echo ""
echo "📧 To complete the flow:"
echo "1. Check your email for verification link"
echo "2. Click the verification link"
echo "3. Then try logging in again"
echo ""
echo "🔍 Manual verification endpoint format:"
echo "GET $API_BASE/auth/verify-email?token=YOUR_EMAIL_TOKEN"
