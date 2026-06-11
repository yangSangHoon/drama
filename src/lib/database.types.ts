import type { BodolColor, BodolExpression } from '@/components/mascot/types'

/** profiles 테이블 (auth.users 1:1) */
export interface Profile {
  id: string
  nickname: string
  avatar_expression: BodolExpression
  avatar_color: BodolColor
  created_at: string
}

/** rooms 테이블 (메타정보만, 메시지는 저장 안 함) */
export interface Room {
  id: string
  host_id: string | null
  drama_title: string
  episode: string | null
  starts_at: string
  description: string | null
  spoiler_ok: boolean
  created_at: string
}

export type FriendshipStatus = 'pending' | 'accepted'

/** friendships 테이블 (요청/수락) */
export interface Friendship {
  id: string
  requester_id: string
  addressee_id: string
  status: FriendshipStatus
  created_at: string
}
