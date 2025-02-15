-- Drop existing policies
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can insert their own profile." on profiles;
drop policy if exists "Users can update own profile." on profiles;

-- Create new policies with role-based access
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
      when auth.uid() = id then true  -- Users can update their own profile
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
create index if not exists idx_profiles_role on profiles (role);

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