-- ============================================================
-- 같이볼래? (Gachibollae) DB 스키마
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- (CLAUDE.md §5 기준)
-- ============================================================

-- 프로필 (auth.users 1:1)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null check (char_length(nickname) <= 10),
  avatar_expression text not null default 'smile',  -- smile|wink|cry|angry|heart|surprise
  avatar_color text not null default 'coral',       -- coral|lavender|butter|mint|sky
  created_at timestamptz default now()
);

-- 채팅방 (메타정보만 저장, 메시지는 저장 안 함)
create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  host_id uuid references profiles(id) on delete set null,
  drama_title text not null,
  episode text,
  starts_at timestamptz not null,
  description text,
  spoiler_ok boolean default true,
  created_at timestamptz default now()
);

-- 친구 관계 (요청/수락)
create table if not exists friendships (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid references profiles(id) on delete cascade,
  addressee_id uuid references profiles(id) on delete cascade,
  status text not null default 'pending',  -- pending|accepted
  created_at timestamptz default now(),
  unique (requester_id, addressee_id)
);

-- 리스트 정렬/검색 인덱스
create index if not exists rooms_starts_at_idx on rooms (starts_at desc);

-- ── RLS 활성화 ──
alter table profiles enable row level security;
alter table rooms enable row level security;
alter table friendships enable row level security;

-- profiles: 누구나 읽기, 본인만 쓰기
drop policy if exists "profiles_read" on profiles;
create policy "profiles_read" on profiles for select using (true);
drop policy if exists "profiles_insert" on profiles;
create policy "profiles_insert" on profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update" on profiles;
create policy "profiles_update" on profiles for update using (auth.uid() = id);

-- rooms: 누구나 읽기, 로그인 유저 생성, 방장만 수정/삭제
drop policy if exists "rooms_read" on rooms;
create policy "rooms_read" on rooms for select using (true);
drop policy if exists "rooms_insert" on rooms;
create policy "rooms_insert" on rooms for insert with check (auth.uid() = host_id);
drop policy if exists "rooms_update" on rooms;
create policy "rooms_update" on rooms for update using (auth.uid() = host_id);
drop policy if exists "rooms_delete" on rooms;
create policy "rooms_delete" on rooms for delete using (auth.uid() = host_id);

-- friendships: 당사자만 읽기/쓰기
drop policy if exists "friendships_read" on friendships;
create policy "friendships_read" on friendships for select
  using (auth.uid() in (requester_id, addressee_id));
drop policy if exists "friendships_insert" on friendships;
create policy "friendships_insert" on friendships for insert
  with check (auth.uid() = requester_id);
drop policy if exists "friendships_update" on friendships;
create policy "friendships_update" on friendships for update
  using (auth.uid() = addressee_id);
