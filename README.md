# Next.js Admin Dashboard

A modern admin dashboard built with Next.js 14, Material UI, Supabase Auth, TypeScript, and Tailwind CSS.

## Features

- 🔐 Authentication with Supabase Auth
  - Email/Password Authentication
  - Password Reset
  - Registration with Email Verification
- 👥 User Management
  - User List with Filtering and Sorting
  - User Role Management
  - User Profile Management
- 🛡️ Role-based Access Control
- 🎨 Modern UI with Material UI v5
  - Responsive Design
  - Dark/Light Theme Support
  - Custom Theme Configuration
- 🎯 TypeScript for Type Safety
- 📱 Responsive Design
- 📊 Dashboard Analytics
  - User Statistics
  - Activity Monitoring
  - Real-time Updates

## Tech Stack

- Next.js 14
- Material UI v5
- Supabase
- TypeScript
- Tailwind CSS

## Getting Started

1. Clone the repository
```bash
git clone https://github.com/yourusername/next-admin-dashboard.git
cd next-admin-dashboard
```

2. Copy `.env.example` to `.env.local` and add your Supabase credentials
```bash
cp .env.example .env.local
```

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
│   │   ├── login/     # Login page
│   │   ├── register/  # Registration page
│   │   └── reset/     # Password reset
│   ├── (admin)/       # Protected admin routes
│   │   ├── users/     # User management
│   │   └── settings/  # Admin settings
│   ├── (user)/        # Protected user routes
│   ├── layout.tsx     # Root layout with MUI providers
│   └── page.tsx       # Landing page
├── components/        # Reusable components
├── lib/              # Utilities and types
│   ├── theme.ts      # MUI theme configuration
│   └── supabase/     # Supabase utilities
└── middleware.ts     # Auth protection
```

## Setting up Supabase

1. Create a new Supabase project
2. Set up user authentication
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
```

## Features in Development

- [ ] Enhanced User Management
- [ ] Advanced Analytics Dashboard
- [ ] Activity Logging
- [ ] Audit Trail
- [ ] Enhanced Security Features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT