import { supabase } from './supabase'
import type { Room } from './database.types'

export interface CreateRoomInput {
  drama_title: string
  episode?: string | null
  /** ISO 문자열 */
  starts_at: string
  description?: string | null
  spoiler_ok: boolean
}

/** 방 생성 (host_id = 현재 로그인 유저) */
export async function createRoom(input: CreateRoomInput): Promise<Room> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요해요.')

  const { data, error } = await supabase
    .from('rooms')
    .insert({
      host_id: user.id,
      drama_title: input.drama_title,
      episode: input.episode || null,
      starts_at: input.starts_at,
      description: input.description || null,
      spoiler_ok: input.spoiler_ok,
    })
    .select()
    .single()

  if (error) throw error
  return data as Room
}

/** 방 목록. 검색어가 있으면 드라마 제목 부분일치(ilike). 시작 시간 내림차순. */
export async function listRooms(search?: string): Promise<Room[]> {
  let query = supabase.from('rooms').select('*').order('starts_at', { ascending: false }).limit(100)

  const q = search?.trim()
  if (q) query = query.ilike('drama_title', `%${q}%`)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Room[]
}

export async function getRoom(id: string): Promise<Room | null> {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', id).maybeSingle()
  if (error) throw error
  return (data as Room) ?? null
}

export async function deleteRoom(id: string): Promise<void> {
  const { error } = await supabase.from('rooms').delete().eq('id', id)
  if (error) throw error
}

/** 수락된 친구들의 user id 목록 — "친구방" 필터용 (M6에서 친구 추가 UI 연결) */
export async function getFriendIds(): Promise<string[]> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return []

  const { data, error } = await supabase
    .from('friendships')
    .select('requester_id, addressee_id, status')
    .eq('status', 'accepted')
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

  if (error) {
    console.error('[rooms] 친구 목록 조회 실패:', error.message)
    return []
  }

  return (data ?? []).map((f) =>
    f.requester_id === user.id ? (f.addressee_id as string) : (f.requester_id as string),
  )
}
