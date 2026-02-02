# PowerShell Script สำหรับ setup environment file

Write-Host "🔧 Setting up environment file..." -ForegroundColor Cyan
Write-Host ""

# ตรวจสอบว่ามี .env อยู่แล้วหรือไม่
if (Test-Path .env) {
    Write-Host "⚠️  .env file already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "❌ Cancelled. Keeping existing .env file." -ForegroundColor Red
        exit 0
    }
}

# เลือก environment
Write-Host ""
Write-Host "Select environment:" -ForegroundColor Yellow
Write-Host "1) Development (ใช้ .env.development)"
Write-Host "2) Production (ใช้ .env.example และให้คุณแก้ไขเอง)"
$choice = Read-Host "Enter choice [1-2]"

switch ($choice) {
    "1" {
        Write-Host "📋 Copying .env.development to .env..." -ForegroundColor Cyan
        Copy-Item .env.development .env -Force
        Write-Host "✅ Development environment file created!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  Note: This is for development only." -ForegroundColor Yellow
        Write-Host "   For production, use .env.example and update with real values."
    }
    "2" {
        Write-Host "📋 Copying .env.example to .env..." -ForegroundColor Cyan
        Copy-Item .env.example .env -Force
        Write-Host "✅ Production environment file created!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Please edit .env file and update:" -ForegroundColor Yellow
        Write-Host "   - MSSQL_SA_PASSWORD (use strong password)"
        Write-Host "   - JWT_SECRET (use complex random string, min 32 chars)"
        Write-Host "   - DB_PASS (use strong password)"
        Write-Host ""
        Write-Host "   Edit with: notepad .env"
    }
    default {
        Write-Host "❌ Invalid choice. Exiting." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "✅ Setup complete! You can now run:" -ForegroundColor Green
Write-Host "   docker-compose up -d" -ForegroundColor Cyan

