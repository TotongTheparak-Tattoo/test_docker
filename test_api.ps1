# Test API Script

Write-Host "Testing Minebea Auth Service API" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Test 1: Register a new user
Write-Host "1. Testing User Registration..." -ForegroundColor Yellow
$registerBody = @{
    empNo = "EMP005"
    email = "test@minebea.co.th"
    fullName = "Test User"
    password = "testpass123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:6200/api/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    Write-Host "✅ Registration successful!" -ForegroundColor Green
    Write-Host ($registerResponse | ConvertTo-Json)
} catch {
    Write-Host "❌ Registration failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Login with existing user
Write-Host "2. Testing User Login..." -ForegroundColor Yellow
$loginBody = @{
    empNo = "EMP001"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:6200/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login successful!" -ForegroundColor Green
    Write-Host "Token: $($loginResponse.token.Substring(0, 30))..." -ForegroundColor Cyan
    Write-Host "User: $($loginResponse.user | ConvertTo-Json)"
    $token = $loginResponse.token
} catch {
    Write-Host "❌ Login failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: Verify Token
if ($token) {
    Write-Host "3. Testing Token Verification..." -ForegroundColor Yellow
    try {
        $headers = @{
            "Authorization" = "Bearer $token"
        }
        $verifyResponse = Invoke-RestMethod -Uri "http://localhost:6200/api/auth/verify-token" -Method Get -Headers $headers
        Write-Host "✅ Token verified!" -ForegroundColor Green
        Write-Host ($verifyResponse | ConvertTo-Json)
    } catch {
        Write-Host "❌ Token verification failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=================================" -ForegroundColor Green
Write-Host "API Testing Complete!" -ForegroundColor Green

