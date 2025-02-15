-- First, delete all existing users and their profiles
truncate auth.users cascade;

-- Create admin user
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@email.com',
  crypt('12345', gen_salt('bf')),
  now(),
  '{"role": "admin"}'::jsonb,
  '{}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Create standard user
insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) values (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'user@email.com',
  crypt('12345', gen_salt('bf')),
  now(),
  '{"role": "user"}'::jsonb,
  '{}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Update profiles table to set roles (this will be handled by the trigger)
update profiles 
set role = 'admin'
where email = 'admin@email.com';

update profiles 
set role = 'user'
where email = 'user@email.com'; 