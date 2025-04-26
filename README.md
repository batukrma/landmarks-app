# Landmarks App

A modern web application built with Next.js that allows users to explore and interact with landmarks. The application features user authentication, interactive maps, and a responsive design.

## Features

- User authentication and authorization
- Interactive maps using Leaflet
- Responsive design with Tailwind CSS
- Type-safe development with TypeScript
- Real-time data management with Supabase
- Form handling with React Hook Form and Zod validation

## Tech Stack

- **Framework**: Next.js 15.3.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Maps**: Leaflet with React-Leaflet
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- Supabase account and project

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd landmarks-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Generate database types:
   ```bash
   npm run db-types
   # or
   yarn db-types
   ```

5. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Available Scripts

- `npm run dev` - Start the development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality
- `npm run db-types` - Generate TypeScript types from Supabase schema

## Project Structure

```
landmarks-app/
├── app/                 # Next.js app directory
│   ├── api/            # API routes
│   ├── auth/           # Authentication related pages
│   ├── login/          # Login page
│   └── components/     # App-specific components
├── components/         # Shared components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
├── public/            # Static assets
└── constants/         # Application constants
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
