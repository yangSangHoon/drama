import { supabase } from './supabase'

const BUCKET = 'chat-images'
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif']

export class ImageUploadError extends Error {}

/**
 * 채팅 이미지를 chat-images 버킷에 업로드하고 public URL을 반환.
 * 경로: {roomId}/{uuid}.{ext}
 */
export async function uploadChatImage(roomId: string, file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new ImageUploadError('PNG · JPG · WEBP · GIF 이미지만 올릴 수 있어요.')
  }
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageUploadError('이미지는 5MB까지 올릴 수 있어요.')
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
  const path = `${roomId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  if (error) throw new ImageUploadError(error.message)

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
