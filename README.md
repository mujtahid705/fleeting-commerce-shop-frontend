# Fleeting Commerce - Your Modern Shopping Experience

A modern, responsive e-commerce website built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## Features

- 🛍️ **Modern E-commerce UI** - Beautiful, responsive design with smooth animations
- 🎨 **Component-Based Architecture** - Modular, reusable components following Next.js best practices
- 📱 **Mobile-First Design** - Fully responsive across all devices
- ⚡ **Performance Optimized** - Built with Next.js 15 for optimal performance
- 🎭 **Smooth Animations** - Powered by Framer Motion for engaging user interactions
- 🎯 **TypeScript** - Full type safety throughout the application
- 🎨 **Tailwind CSS** - Utility-first CSS framework for rapid development
- 🔧 **Modern Tooling** - ESLint, Prettier, and other development tools

## Pages & Components

### Pages

- **Home Page** (`/`) - Hero section, categories, featured products
- **Products Page** (`/products`) - Product listing with search and filters
- **Product Detail** (`/products/[id]`) - Individual product view with image gallery
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - User registration

### Components

- **Layout Components** - Header, Footer
- **UI Components** - Button, Input, Card, Badge, Select, Checkbox
- **Product Components** - ProductCard, ImageWithFallback
- **Home Components** - HeroSection, CategoriesSection, ProductsSection

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd fleeting-commerce-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run the development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Required Packages

The following packages are required for this application:

### Core Dependencies

```bash
npm install framer-motion lucide-react @radix-ui/react-slot @radix-ui/react-label @radix-ui/react-select @radix-ui/react-checkbox class-variance-authority clsx tailwind-merge
```

### Development Dependencies

```bash
npm install -D tailwindcss-animate
```

## Project Structure

```
src/
├── app/                    # Next.js 15 app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── login/             # Login page
│   ├── register/          # Register page
│   └── products/          # Products pages
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── layout/           # Layout components
│   ├── home/             # Home page components
│   └── products/         # Product-related components
└── lib/                  # Utility functions
    └── utils.ts          # Common utilities
```

## Key Features

### 1. Responsive Design

- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation

### 2. Animations

- Page transitions
- Hover effects
- Loading animations
- Scroll-triggered animations

### 3. Product Management

- Product listing with filters
- Search functionality
- Category filtering
- Product detail pages

### 4. User Authentication

- Login/Register forms
- Form validation
- Password visibility toggle

### 5. Modern UI/UX

- Clean, modern design
- Consistent color scheme
- Accessible components
- Smooth interactions

## Customization

### Colors

The application uses a custom color scheme defined in `tailwind.config.ts`. You can modify the colors in the `theme.extend.colors` section.

### Components

All UI components are located in `src/components/ui/` and can be easily customized or extended.

### Styling

The application uses Tailwind CSS for styling. You can modify styles in the respective component files or add custom styles in `src/app/globals.css`.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

The project uses:

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Note**: This is a frontend-only application. For a complete e-commerce solution, you'll need to integrate with a backend API for user authentication, product management, and order processing.
