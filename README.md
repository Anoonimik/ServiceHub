# ServiceHub - Universal Service Booking Platform

A modern, full-stack service booking platform built with Next.js 14, TypeScript, MySQL, and Docker. Users can offer their services as providers or book services from others.

## Features

- 🔐 **User Authentication** - JWT-based authentication with "Remember me" functionality
- 👤 **User Dashboard** - Personal profile and appointment management
- 🏢 **Provider System** - Become a service provider and manage your services
- 📅 **Service Booking** - Easy appointment reservation system
- 🎨 **Modern UI** - Built with Tailwind CSS and responsive design
- 🏗️ **Clean Architecture** - Domain-driven design with separation of concerns
- 🐳 **Docker Support** - Easy deployment with Docker Compose

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Tokens)
- **State Management**: Zustand
- **Architecture**: Clean Architecture + Feature-Sliced Design (FSD)

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

## Getting Started

### Using Docker (Recommended)

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ServiceHub
```

2. Start the application:
```bash
docker-compose up -d
```

3. The application will be available at:
   - Frontend: http://localhost:3000
   - MySQL: localhost:3306

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (create `.env.local`):
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=servicehub_user
DB_PASSWORD=servicehub_password
DB_NAME=servicehub_db
JWT_SECRET=your-secret-key-change-in-production
```

3. Start MySQL database (using Docker):
```bash
docker-compose up -d servicehub_mysql
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
├── app/                    # Next.js App Router pages and API routes
├── domain/                 # Domain layer (entities, repositories interfaces)
├── application/            # Application layer (use cases, DTOs)
├── infrastructure/         # Infrastructure layer (repositories, services)
├── entities/               # Feature-Sliced Design: entities
├── features/               # Feature-Sliced Design: features
├── widgets/                # Feature-Sliced Design: widgets
├── shared/                 # Shared utilities and components
├── database/               # Database initialization scripts
└── docker-compose.yml      # Docker configuration
```

## Database Schema

- `users` - User accounts
- `service_providers` - Provider profiles
- `services` - Services offered by providers
- `reservations` - Service bookings
- `customers` - Customer information for reservations

## Environment Variables

Create a `.env.local` file for local development:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=servicehub_user
DB_PASSWORD=servicehub_password
DB_NAME=servicehub_db
JWT_SECRET=your-secret-key-change-in-production
```

## Docker Services

- `servicehub_nextjs` - Next.js application
- `servicehub_mysql` - MySQL 8.0 database

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## License

This project is private and proprietary.

## Author

Your Name

