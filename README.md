# Minnesota Creative Guide

*A comprehensive platform for discovering and exploring creative resources, organizations, and events across Minnesota*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mohancodes-projects/v0-minnesota-creative-guide)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/oyte7qMtAHY)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

The Minnesota Creative Guide is a modern web application built to connect users with creative resources throughout Minnesota. This platform serves as a comprehensive directory for artists, creative organizations, events, and opportunities in the Minnesota creative ecosystem.

**Key Objectives:**
- Provide a centralized hub for Minnesota's creative community
- Enable easy discovery of creative resources and organizations
- Facilitate community engagement and collaboration
- Support the growth of Minnesota's creative economy

### v0.app Integration

This repository is automatically synced with your [v0.app](https://v0.app) deployments. Any changes you make to your deployed app will be automatically pushed to this repository from [v0.app](https://v0.app).

## Features

### **Interactive Map**
- Browse creative resources and organizations geographically
- Filter by category, location, and availability
- Real-time location-based search

### **Resource Directory**
- Comprehensive database of creative organizations
- Detailed profiles with contact information
- Category-based browsing and filtering

### **User Profiles**
- Personalized experience with authentication
- Save favorite resources and organizations
- Track engagement history

### **Advanced Search**
- Full-text search across all resources
- Multi-criteria filtering
- Smart recommendations

### **Responsive Design**
- Mobile-first approach
- Progressive Web App capabilities
- Cross-browser compatibility

## Tech Stack

### **Frontend Framework**
- **Next.js 16.0.3** - React framework with SSR/SSG
- **React 19** - UI library
- **TypeScript 5.x** - Type-safe JavaScript

### **UI Components & Styling**
- **Tailwind CSS 4.1.9** - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible components
- **Lucide React** - Icon library
- **Framer Motion** - Animation library

### **Data & State Management**
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Supabase** - Backend as a Service
- **React Query** - Server state management

### **Maps & Geolocation**
- **Leaflet** - Interactive maps
- **React Leaflet** - React integration for Leaflet
- **React Leaflet Cluster** - Marker clustering

### **Development Tools**
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm
- Git

### Clone the Repository
```bash
git clone https://github.com/mohancodes/v0-minnesota-creative-guide.git
cd v0-minnesota-creative-guide
```

### Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

## Environment Setup

1. **Create Environment Variables**
   ```bash
   cp .env.example .env.local
   ```

2. **Configure Environment Variables**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # Vercel Analytics (Optional)
   VERCEL_ANALYTICS_ID=your_vercel_analytics_id
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Run the provided SQL migrations
   - Configure authentication providers

## Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

## Project Structure

```
v0-minnesota-creative-guide/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── auth/              # Authentication pages
│   ├── browse/            # Resource browsing
│   ├── map/               # Interactive map
│   ├── organizations/     # Organization directory
│   ├── profile/           # User profiles
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
├── contexts/              # React contexts
├── data/                  # Static data and mock data
├── lib/                   # Utility functions and configurations
├── public/                # Static assets
├── styles/                # CSS and styling files
└── utils/                 # Helper utilities
```

## Deployment

### **Vercel Deployment**
Your project is automatically deployed on Vercel:

**[https://vercel.com/mohancodes-projects/v0-minnesota-creative-guide](https://vercel.com/mohancodes-projects/v0-minnesota-creative-guide)**

### **Manual Deployment**
```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod
```

### **Environment Variables for Production**
Ensure all environment variables are configured in your Vercel dashboard before deployment.

## Contributing

We welcome contributions from the community! Here's how you can help:

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Code Guidelines**
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Ensure all components are properly typed
- Test your changes thoroughly

### **Reporting Issues**
- Use GitHub Issues for bug reports
- Provide detailed reproduction steps
- Include screenshots when applicable
- Tag relevant team members

## Build Your App

Continue building your app on [v0.app](https://v0.app):

**[https://v0.app/chat/oyte7qMtAHY](https://v0.app/chat/oyte7qMtAHY)**

## How It Works

1. **Create** and modify your project using [v0.app](https://v0.app)
2. **Deploy** your chats from the v0 interface
3. **Sync** changes are automatically pushed to this repository
4. **Deploy** Vercel deploys the latest version from this repository

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Built with [v0.app](https://v0.app)
- Deployed on [Vercel](https://vercel.com)
- Powered by [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Connect with us:**
- Email: [contact@example.com](mailto:contact@example.com)
- Twitter: [@MNCreativeGuide](https://twitter.com/MNCreativeGuide)
- Instagram: [@mncreativeguide](https://instagram.com/mncreativeguide)
