import { supabase } from './supabase'
import type { Profile } from './database.types'

/** 나와 상대 사이의 관계 */
export interface FriendRelations {
  /** 수락된 친구 user_id */
  friends: Set<string>
  /** 내가 받은 요청: requesterId → friendshipId */
  incoming: Map<string, string>
  /** 내가 보낸 요청: addresseeId 집합 */
  outgoing: Set<string>
}

async function currentUserId(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

/** 내 모든 친구관계를 한 번에 로드해 관계 맵으로 변환 */
export async function loadRelations(): Promise<FriendRelations> {
  const empty: FriendRelations = { friends: new Set(), incoming: new Map(), outgoing: new Set() }
  const me = await currentUserId()
  if (!me) return empty

  const { data, error } = await supabase
    .from('friendships')
    .select('id, requester_id, addressee_id, status')
  if (error) {
    console.error('[friends] 관계 로드 실패:', error.message)
    return empty
  }

  const rel: FriendRelations = { friends: new Set(), incoming: new Map(), outgoing: new Set() }
  for (const f of data ?? []) {
    const other = f.requester_id === me ? f.addressee_id : f.requester_id
    if (f.status === 'accepted') {
      rel.friends.add(other)
    } else if (f.addressee_id === me) {
      rel.incoming.set(f.requester_id, f.id)
    } else {
      rel.outgoing.add(f.addressee_id)
    }
  }
  return rel
}

export async function getProfilesByIds(ids: string[]): Promise<Profile[]> {
  if (ids.length === 0) return []
  const { data, error } = await supabase.from('profiles').select('*').in('id', ids)
  if (error) throw error
  return (data ?? []) as Profile[]
}

/** 친구 요청 보내기 */
export async function sendFriendRequest(addresseeId: string): Promise<void> {
  const me = await currentUserId()
  if (!me) throw new Error('로그인이 필요해요.')
  if (me === addresseeId) throw new Error('자기 자신은 친구로 추가할 수 없어요.')

  const { error } = await supabase
    .from('friendships')
    .insert({ requester_id: me, addressee_id: addresseeId, status: 'pending' })
  if (error) {
    // 23505 = unique 위반 (이미 요청함)
    if (error.code === '23505') throw new Error('이미 친구 요청을 보냈어요.')
    throw error
  }
}

/** 받은 요청 수락 */
export async function acceptFriendRequest(friendshipId: string): Promise<void> {
  const { error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
  if (error) throw error
}

/** 수락된 친구 프로필 목록 */
export async function listFriends(): Promise<Profile[]> {
  const rel = await loadRelations()
  return getProfilesByIds([...rel.friends])
}

/** 받은(대기 중) 친구 요청 목록 */
export async function listIncomingRequests(): Promise<
  { friendshipId: string; profile: Profile }[]
> {
  const rel = await loadRelations()
  const profiles = await getProfilesByIds([...rel.incoming.keys()])
  const byId = new Map(profiles.map((p) => [p.id, p]))
  return [...rel.incoming.entries()]
    .map(([requesterId, friendshipId]) => {
      const profile = byId.get(requesterId)
      return profile ? { friendshipId, profile } : null
    })
    .filter((x): x is { friendshipId: string; profile: Profile } => x !== null)
}
