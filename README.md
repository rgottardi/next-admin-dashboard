# Next.js Admin Dashboard

A modern admin dashboard built with Next.js 14, Material UI, Supabase Auth, TypeScript, and Tailwind CSS.

## Features

- 🔐 Authentication System
  - Email/Password Authentication
  - Registration with Email Verification
  - Password Reset Functionality
  - Protected Routes with Role-Based Access
  - Automatic Session Management

- 👥 User Management
  - User List with Material UI Data Grid
  - Role Management (Admin/User)
  - User Profile Management
  - User Activity Tracking
  - Bulk Actions Support

- 🛡️ Admin Features
  - Material UI Admin Dashboard
  - User Management Interface
  - Settings Management
  - Role-based Access Control
  - Navigation Drawer Layout

- 🎨 Modern UI Components
  - Material UI v5 Integration
  - Responsive Design
  - Dark/Light Theme Support
  - Custom Theme Configuration
  - Interactive Data Grids

## Tech Stack

- **Frontend Framework**: Next.js 14
- **UI Libraries**:
  - Material UI v5
  - Tailwind CSS
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Language**: TypeScript
- **State Management**: React Hooks

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/next-admin-dashboard.git
cd next-admin-dashboard
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

4. Run the development server
```bash
npm run dev
```

## Project Structure

```
├── app/
│   ├── (auth)/              # Authentication routes
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   ├── reset-password/ # Password reset request
│   │   └── update-password/# Password update
│   ├── (admin)/            # Protected admin routes
│   │   ├── layout.tsx     # Admin layout with drawer
│   │   ├── page.tsx       # Admin dashboard
│   │   ├── users/         # User management
│   │   └── settings/      # Admin settings
│   ├── (user)/            # Protected user routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/            # Reusable components
├── lib/                  # Utilities and types
│   ├── theme.ts         # MUI theme configuration
│   ├── createEmotionCache.ts  # MUI cache setup
│   └── supabase/        # Supabase utilities
└── middleware.ts        # Auth protection
```

## Setting up Supabase

1. Create a new Supabase project
2. Set up authentication:
   - Enable Email auth provider
   - Configure email templates
3. Run the following SQL in your Supabase SQL editor:

```sql
-- Create a table for user profiles
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  role text check (role in ('admin', 'user')),
  updated_at timestamp with time zone,
  primary key (id)
);

-- Create a trigger to set updated_at on profiles
create trigger handle_updated_at before update on profiles
  for each row execute procedure moddatetime (updated_at);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

-- Create policies
create policy "Users can view their own profile"
  on profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

create policy "Admins can view all profiles"
  on profiles for select
  using ( auth.jwt() ->> 'role' = 'admin' );

create policy "Admins can update all profiles"
  on profiles for update
  using ( auth.jwt() ->> 'role' = 'admin' );
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication Flow

1. **Registration**:
   - User submits registration form
   - Email verification is sent
   - User profile is created with default role

2. **Login**:
   - User submits login credentials
   - Role-based redirect (admin/user)
   - Session management

3. **Password Reset**:
   - User requests password reset
   - Reset link sent via email
   - Password update form

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT