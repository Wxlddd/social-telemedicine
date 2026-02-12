-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Linked to auth.users)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  role text check (role in ('patient', 'doctor')),
  is_verified_doctor boolean default false,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- 2. POSTS
create table public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  type text check (type in ('insight', 'consultation')) not null,
  content text,
  video_url text, -- For TikTok style insights or video questions
  thumbnail_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

create policy "Everyone can read posts"
  on posts for select
  using ( true );

-- Insight: Only verified doctors can create
create policy "Verified Doctors can create insights"
  on posts for insert
  with check (
    type = 'insight' AND
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'doctor'
      and is_verified_doctor = true
    )
  );

-- Consultation: Patients can create
create policy "Patients can create consultations"
  on posts for insert
  with check (
    type = 'consultation' AND
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'patient'
    )
  );

-- 3. COMMENTS
create table public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) not null,
  user_id uuid references public.profiles(id) not null,
  content text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Everyone can read comments"
  on comments for select
  using ( true );

-- Strict Comment Logic
create policy "Only Verified Doctors can comment"
  on comments for insert
  with check (
    exists (
      select 1 from profiles
      where id = auth.uid()
      and role = 'doctor'
      and is_verified_doctor = true
    )
  );

-- TRIGGER to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'role', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
