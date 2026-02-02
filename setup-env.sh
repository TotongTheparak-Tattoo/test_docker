#!/bin/bash
# Script สำหรับ setup environment file

echo "🔧 Setting up environment file..."

# ตรวจสอบว่ามี .env อยู่แล้วหรือไม่
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Cancelled. Keeping existing .env file."
        exit 0
    fi
fi

# เลือก environment
echo ""
echo "Select environment:"
echo "1) Development (ใช้ .env.development)"
echo "2) Production (ใช้ .env.example และให้คุณแก้ไขเอง)"
read -p "Enter choice [1-2]: " choice

case $choice in
    1)
        echo "📋 Copying .env.development to .env..."
        cp .env.development .env
        echo "✅ Development environment file created!"
        echo ""
        echo "⚠️  Note: This is for development only."
        echo "   For production, use .env.example and update with real values."
        ;;
    2)
        echo "📋 Copying .env.example to .env..."
        cp .env.example .env
        echo "✅ Production environment file created!"
        echo ""
        echo "⚠️  IMPORTANT: Please edit .env file and update:"
        echo "   - MSSQL_SA_PASSWORD (use strong password)"
        echo "   - JWT_SECRET (use complex random string, min 32 chars)"
        echo "   - DB_PASS (use strong password)"
        echo ""
        echo "   Edit with: nano .env"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "✅ Setup complete! You can now run:"
echo "   docker-compose up -d"

