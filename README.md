# Next.js Admin Dashboard

A modern admin dashboard built with Next.js 14, Supabase Auth, TypeScript, and Tailwind CSS.

## Features

- 🔐 Authentication with Supabase Auth
- 👥 User Management
- 🛡️ Role-based Access Control
- 🎨 Modern UI with Tailwind CSS
- 🎯 TypeScript for type safety
- 📱 Responsive Design

## Getting Started

1. Clone the repository
2. Copy `.env.example` to `.env.local` and add your Supabase credentials
3. Install dependencies:
   ```bash
   npm install
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── app/
│   ├── (auth)/        # Authentication routes
│   ├── (admin)/       # Protected admin routes
│   ├── (user)/        # Protected user routes
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Landing page
├── components/        # Reusable components
├── lib/              # Utilities and types
└── middleware.ts     # Auth protection
```

## License

MIT