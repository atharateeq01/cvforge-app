# CVForge App

CVForge is a web application designed to help users create and manage their resumes and CVs. It provides a user-friendly interface for inputting personal information, education, experience, skills, and more, and then generates a professional-looking CV.

## Project Structure

This project is built with Next.js and uses Drizzle ORM for database interactions. The key directories are:

- `app/`: Contains the main application pages and API routes.
- `components/`: Reusable UI components.
- `features/`: Feature-specific components and logic, such as CV forms.
- `lib/`: Utility functions, database configurations, and authentication setup.
- `public/`: Static assets like images.
- `store/`: Zustand store for global state management.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

Make sure you have the following installed:

- Node.js (v18 or higher)
- pnpm (or npm/yarn)
- PostgreSQL (or another compatible database)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cvforge-app
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory based on `env.example` and fill in the necessary values, especially for your database and Supabase (if used).

   ```
   DATABASE_URL="your_database_connection_string"
   NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your_supabase_anon_key"
   ```

4. Run database migrations:
   ```bash
   pnpm drizzle-kit push:pg
   ```

5. Seed the database (optional):
   ```bash
   pnpm tsx scripts/seed.ts
   ```

### Running the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- User authentication (login/register)
- CV builder with various sections (personal info, education, experience, skills, etc.)
- Real-time preview of the CV
- Responsive design

## Technologies Used

- Next.js
- React
- Tailwind CSS
- Shadcn/ui
- Drizzle ORM
- PostgreSQL
- Supabase (for authentication and potentially database hosting)
- Zustand (for state management)

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Made by

Athar Ateeq
Software Engineer - Full Stack
atharateeq01@gmail.com
Lahore, Pakistan. Ph: +92 347 8448101