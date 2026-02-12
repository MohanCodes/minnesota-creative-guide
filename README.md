# Minnesota Creative Guide

*A comprehensive platform for discovering creative resources, organizations, and opportunities across Minnesota*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mohancodes-projects/v0-minnesota-creative-guide)
[![Next.js](https://img.shields.io/badge/Next.js-16.0.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-black?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

## Overview

The Minnesota Creative Guide is a modern web application that serves as a comprehensive directory for Minnesota's creative ecosystem. **The initial template was created using v0.app, with the remaining functionality and features coded manually** to provide a robust platform that connects artists, creative organizations, and communities. This platform offers an intuitive way to discover galleries, art supply stores, educational programs, theaters, makerspaces, and other creative resources throughout the state.

**Key Objectives:**
- Provide a centralized hub for Minnesota's creative community
- Enable easy discovery of creative resources and organizations
- Facilitate community engagement and collaboration
- Support the growth of Minnesota's creative economy
- Promote diversity and accessibility in the arts

## Features

### **Interactive Map**
- Browse creative resources geographically across Minnesota
- Real-time filtering by category, location, and special attributes
- Clustered markers for better navigation in dense areas
- Detailed popup information for each organization

### **Resource Directory**
- Comprehensive database of creative organizations with detailed profiles
- Advanced search with full-text capabilities
- Multi-criteria filtering (category, location, ownership, accessibility)
- Masonry layout for visual browsing
- Pagination for optimal performance

### **Categories Covered**
- **Art Gallery & Creative Space** - Exhibition venues and creative workspaces
- **Art Program/School** - Educational institutions and art programs
- **Art Supply Store** - Materials and equipment suppliers
- **Community Theatre** - Performance venues and theater groups
- **Dance School & Studio** - Dance education and performance spaces
- **Makerspace** - Shared workshops and fabrication labs
- **Non-profit Art Service Organization** - Community art services
- **Pottery/Sewing Studio** - Craft and textile workspaces

### **Advanced Search & Filtering**
- Full-text search across all resource data
- Filter by location (city, county)
- Filter by diversity attributes (women-owned, POC-owned)
- Filter by accessibility and youth-focused programs
- Real-time search with debouncing

### **Responsive Design**
- Mobile-first approach with progressive enhancement
- Accessible UI components
- Touch-friendly interface for mobile devices
- Cross-browser compatibility

### **Admin Panel**
- Secure authentication system
- Resource management and approval workflow
- Category management

## Tech Stack

### **Frontend Framework**
- **Next.js 16.0.3** - React framework with App Router
- **React 19** - Modern UI library with concurrent features
- **TypeScript 5.x** - Type-safe development experience

### **UI Components & Styling**
- **Tailwind CSS 4.1.9** - Modern utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **shadcn/ui** - High-quality component library built on Radix

### **Data & State Management**
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **React Hook Form** - Performant form management

### **Maps & Geolocation**
- **Leaflet 1.9.4** - Open-source interactive maps
- **React Leaflet 5.0.0** - React integration for Leaflet
- **React Leaflet Cluster 3.1.1** - Marker clustering for performance

### **Additional Libraries**
- **React Masonry CSS** - Pinterest-style layout
- **Date-fns** - Modern date utility library

### **Development Tools**
- **ESLint** - Code quality and consistency
- **PostCSS** - CSS processing pipeline
- **Geist** - Modern font family
- **Sriracha** - Display font for branding

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm package manager
- Git for version control

### Clone and Setup
```bash
# Clone the repository
git clone https://github.com/mohancodes/v0-minnesota-creative-guide.git
cd v0-minnesota-creative-guide

# Install dependencies
npm install

# or using yarn
yarn install

# or using pnpm
pnpm install
```

## Environment Setup

### 1. Create Environment File
```bash
cp .env.example .env.local
```

### 2. Configure Environment Variables
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key

# Vercel Analytics (Optional)
VERCEL_ANALYTICS_ID=your_vercel_analytics_id
```

### 3. Supabase Setup
1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the provided SQL migrations to set up the database schema
3. Configure authentication providers (email, social login)
4. Set up Row Level Security (RLS) policies
5. Enable the required extensions (PostGIS for location data)

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run ESLint for code quality
npm run lint

# Type checking
npm run type-check
```

## Project Structure

```
v0-minnesota-creative-guide/
├── app/                          # Next.js App Router
│   ├── about/                    # About page
│   ├── admin/                    # Admin dashboard
│   │   ├── add/                  # Add new resources
│   │   ├── edit/[id]/           # Edit existing resources
│   │   └── layout.tsx           # Admin layout
│   ├── browse/                   # Resource browsing with filters
│   ├── map/                      # Interactive map view
│   ├── organizations/[id]/       # Individual organization pages
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Homepage
├── components/                   # Reusable UI components
│   ├── ui/                      # shadcn/ui components
│   ├── header.tsx               # Site navigation
│   ├── interactive-map.tsx     # Leaflet map component
│   ├── organization-card.tsx   # Resource card display
│   └── search-filters.tsx      # Advanced filtering UI
├── contexts/                    # React contexts
│   └── AuthContext.tsx          # Authentication context
├── data/                        # Static data
│   └── mock-data.json           # Development mock data
├── lib/                         # Utility functions
│   ├── supabase-utils.ts        # Database operations
│   └── utils.ts                 # General utilities
├── public/                      # Static assets
│   ├── cycle-images/            # Homepage carousel images
│   └── ma6white.png             # Logo
├── utils/                       # Helper utilities
│   └── supabase/                # Supabase client configuration
└── middleware.ts                # Next.js middleware for auth
```

## Database Schema

### **Resources Table**
- Organization information and contact details
- Location data with latitude/longitude
- Category assignments and special attributes
- Approval status for admin moderation

### **Categories Table**
- Category definitions with colors and icons
- Hierarchical organization support
- Customizable metadata

### **Key Features**
- Full-text search capabilities
- Geospatial queries for location-based filtering
- Row Level Security for data protection
- Automatic timestamps and audit trails

## Deployment

### **Vercel Deployment**
The project is automatically deployed on Vercel:

**[https://vercel.com/mohancodes-projects/v0-minnesota-creative-guide](https://vercel.com/mohancodes-projects/v0-minnesota-creative-guide)**

### **Manual Deployment**
```bash
# Build the application
npm run build

# Deploy to Vercel
vercel --prod

# or deploy to other platforms
npm run start  # For Node.js servers
```

### **Environment Variables for Production**
Ensure all environment variables are configured in your deployment platform:
- Supabase URL and keys
- NextAuth configuration
- Analytics tracking IDs

## Contributing

We welcome contributions from the community! Here's how you can help:

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper TypeScript types
4. Test thoroughly: `npm run lint` and `npm run build`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request with detailed description

### **Code Guidelines**
- Follow TypeScript and React best practices
- Use Tailwind CSS for styling consistency
- Write meaningful commit messages following conventional commits
- Ensure all components are properly typed and documented
- Test accessibility with screen readers
- Optimize for mobile devices

### **Reporting Issues**
- Use GitHub Issues for bug reports and feature requests
- Provide detailed reproduction steps and environment info
- Include screenshots or screen recordings for UI issues
- Tag relevant team members for visibility

## Design System

### **Color Palette**
- Primary colors based on category system
- Accessibility-compliant contrast ratios
- Dark/light theme support

### **Typography**
- **Geist** - Primary font for body text
- **Sriracha** - Display font for branding and headings
- Responsive typography scale

### **Component Library**
- Built with shadcn/ui and Radix UI primitives
- Consistent spacing and sizing system
- Mobile-first responsive design

## Security

### **Authentication**
- Supabase Auth with email/password and social providers
- Row Level Security (RLS) for data protection
- Secure session management

### **Data Protection**
- Environment variable configuration
- Input validation with Zod schemas
- XSS protection through React's built-in safeguards
- CSRF protection with Next.js middleware

## Performance

### **Optimization Features**
- Next.js Image optimization for responsive images
- Code splitting with dynamic imports
- Lazy loading for map components
- Debounced search to reduce API calls
- Pagination for large datasets, both on admin page and user page

### **Monitoring**
- Vercel Analytics for performance tracking
- Core Web Vitals optimization
- Error boundary implementation

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Android Chrome)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits
- **Initial Template**: [v0.app](https://v0.app) - AI-powered development tool for the base template
- **Manual Development**: All core functionality, features, and integrations coded manually
- **Deployment**: [Vercel](https://vercel.com) - Modern deployment platform
- **Framework**: [Next.js](https://nextjs.org/) - React framework
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- **Icons**: [Lucide](https://lucide.dev/) - Beautiful icon library
- **Maps**: [Leaflet](https://leafletjs.com/) - Open-source maps

## Contact & Support

**MiracleArts Organization**
- Website: [miraclearts.org](https://miraclearts.org/)
- Email: xavier@miraclearts.org
- Social Media: Follow us for updates and creative community news

---

**Built with 💜 for Minnesota's Creative Community**
