-- ============================================================
-- 같이볼래? Storage: chat-images 버킷
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 실행하세요.
-- (CLAUDE.md §5 — public read, 로그인 유저 업로드, 5MB 제한)
-- ============================================================

-- 버킷 생성 (public read, 5MB, 이미지 타입만)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'chat-images',
  'chat-images',
  true,
  5242880, -- 5MB
  array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
)
on conflict (id) do update
  set public = true,
      file_size_limit = 5242880,
      allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

-- ── 정책 (storage.objects) ──

-- 누구나 읽기 (public 버킷)
drop policy if exists "chat_images_read" on storage.objects;
create policy "chat_images_read" on storage.objects
  for select using (bucket_id = 'chat-images');

-- 로그인 유저만 업로드
drop policy if exists "chat_images_insert" on storage.objects;
create policy "chat_images_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'chat-images');
