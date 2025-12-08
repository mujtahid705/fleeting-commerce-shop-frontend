#!/bin/bash

echo "🚀 Installing Fleeting Commerce Frontend Dependencies..."

# Install core dependencies
echo "📦 Installing core dependencies..."
npm install framer-motion lucide-react @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select @radix-ui/react-checkbox class-variance-authority clsx tailwind-merge

# Install development dependencies
echo "🔧 Installing development dependencies..."
npm install -D tailwindcss-animate

echo "✅ Installation complete!"
echo ""
echo "🎉 Next steps:"
echo "1. Run 'npm run dev' to start the development server"
echo "2. Open http://localhost:3000 in your browser"
echo "3. Start building your e-commerce application!"
echo ""
echo "📚 Check the README.md file for more information about the project structure and features." 