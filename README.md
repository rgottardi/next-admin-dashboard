# Next.js Admin Dashboard

A modern admin dashboard built with Next.js 14, Material UI, Supabase Auth (SSR), TypeScript, and Tailwind CSS.

## Features

- 🔐 Authentication System
  - Email/Password Authentication with SSR Support
  - Registration with Email Verification
  - Password Reset Functionality
  - Protected Routes with Middleware
  - Role-Based Access Control (RBAC)
  - Automatic Session Management with Cookies

- 👥 User Management
  - User List with Material UI Table
  - Role Management (Admin/User)
  - User Profile Management
  - User Activity Tracking

- 🛡️ Admin Features
  - Admin Control Center
  - User Management Interface
  - Settings Management
  - Protected Admin Routes
  - System Analytics
  - Security Settings

- 🎨 Modern UI Components
  - Material UI v5 Integration
  - Responsive Design
  - Dark/Light Theme Support
  - Custom Theme Configuration
  - Server Components Support

- 🔍 Error Handling & Logging
  - Centralized Error Management
  - Structured Logging with Pino
  - Environment-aware Error Messages
  - Custom Error Boundaries
  - API Error Handling
  - Development/Production Error Modes

## Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **UI Libraries**:
  - Material UI v5
  - Material UI Next.js Integration
- **Authentication**: Supabase Auth with SSR (@supabase/ssr)
- **Database**: Supabase PostgreSQL
- **Language**: TypeScript
- **State Management**: React Hooks
- **Logging**: Pino Logger
- **Error Handling**: Custom Error Boundaries

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
│   │   ├── layout.tsx     # Admin layout
│   │   ├── page.tsx       # Admin landing
│   │   ├── users/         # User management
│   │   └── settings/      # Admin settings
│   ├── (user)/            # Protected user routes
│   │   ├── layout.tsx     # User layout
│   │   ├── page.tsx       # User landing
│   │   └── components/    # User components
│   ├── error.tsx          # Global error boundary
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── providers.tsx      # Theme and other providers
├── lib/
│   ├── auth.ts           # Auth utilities
│   ├── error.ts          # Error handling utilities
│   ├── api.ts            # API utilities
│   ├── theme.ts          # MUI theme configuration
│   └── supabase/         # Supabase clients
│       ├── server.ts     # Server-side client
│       └── browser.ts    # Browser client
├── middleware.ts         # Auth middleware
└── supabase/            # Supabase configurations
    └── migrations/      # Database migrations
```

## Setting up Supabase

1. Create a new Supabase project
2. Set up authentication:
   - Enable Email auth provider
   - Configure email templates
3. Run the following SQL in your Supabase SQL editor:

```sql
-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  full_name text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Create policies
create policy "Profiles are viewable by authenticated users"
on profiles
for select
to authenticated
using ( true );

create policy "Users can insert their own profile"
on profiles
for insert
to authenticated
with check ( auth.uid() = id );

create policy "Users can update their own profile"
on profiles
for update
to authenticated
using ( auth.uid() = id )
with check ( 
  auth.uid() = id 
  and (
    case
      when auth.uid() = id then true
      else false
    end
  )
);

create policy "Admins can update any profile"
on profiles
for update
to authenticated
using ( 
  exists (
    select 1 
    from profiles 
    where id = auth.uid() 
    and role = 'admin'
  )
)
with check ( true );

-- Create index for role-based queries
create index idx_profiles_role on profiles (role);

-- Add admin role check function
create or replace function is_admin()
returns boolean
language sql security definer
set search_path = public
as $$
  select exists (
    select 1
    from profiles
    where id = auth.uid()
    and role = 'admin'
  );
$$;

-- Create trigger for updating timestamps
create or replace function handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on profiles
  for each row
  execute procedure handle_updated_at();

-- Create trigger to automatically create a profile when a user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

## Authentication Flow

1. **Registration**:
   - User submits registration form
   - Email verification is sent
   - Profile is automatically created with 'user' role

2. **Login**:
   - User submits login credentials
   - Session stored in cookies
   - Redirect based on user role:
     - Admin users -> Admin Control Center
     - Regular users -> User Landing Page

3. **Password Reset**:
   - User requests password reset
   - Reset link sent via email
   - Password update form

## Role-Based Access

1. **User Roles**:
   - `admin`: Full system access
   - `user`: Limited access to user features

2. **Access Control**:
   - Middleware checks user role
   - Database RLS policies enforce access
   - UI adapts based on user role

## Error Handling

1. **Client-Side Errors**:
   - Global Error Boundary
   - Component-Level Error Boundaries
   - Development Mode Detailed Errors

2. **Server-Side Errors**:
   - Centralized Error Handling
   - Structured Error Logging
   - Custom Error Classes

3. **API Errors**:
   - Consistent Error Responses
   - Status Code Management
   - Error Context Preservation

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT