import { useCallback, useEffect, useRef, useState } from 'react'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { BodolColor, BodolExpression } from '@/components/mascot/types'

export interface ChatUser {
  user_id: string
  nickname: string
  expression: BodolExpression
  color: BodolColor
}

/** Broadcast `message` 이벤트 페이로드 (DB 미저장, 휘발성) */
export interface ChatMessage {
  id: string
  user: ChatUser
  text?: string
  image_url?: string
  ts: number
}

export type PresenceMember = ChatUser

export type ChannelStatus = 'connecting' | 'joined' | 'error'

/** 메시지별 공감 반응: { [messageId]: { [emoji]: userId[] } } */
export type ReactionMap = Record<string, Record<string, string[]>>

export interface RoomChannel {
  messages: ChatMessage[]
  members: PresenceMember[]
  reactions: ReactionMap
  status: ChannelStatus
  sendMessage: (text: string) => void
  sendImage: (imageUrl: string) => void
  toggleReaction: (messageId: string, emoji: string) => void
}

/**
 * 방 Realtime 채널 (채널명 `room:{id}`).
 * - Broadcast: 텍스트 메시지 실시간 중계 (저장 안 함)
 * - Presence: 참여자 목록 / 인원 수
 * 스펙 §6 의 채널/이벤트 구조를 따른다.
 */
export function useRoomChannel(roomId: string | undefined, me: ChatUser | null): RoomChannel {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [members, setMembers] = useState<PresenceMember[]>([])
  const [reactions, setReactions] = useState<ReactionMap>({})
  const [status, setStatus] = useState<ChannelStatus>('connecting')
  const channelRef = useRef<RealtimeChannel | null>(null)

  useEffect(() => {
    if (!roomId || !me) return

    setStatus('connecting')
    setMessages([])
    setReactions({})

    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { self: true }, // 내 메시지도 받아서 단일 경로로 렌더
        presence: { key: me.user_id },
      },
    })
    channelRef.current = channel

    channel.on('broadcast', { event: 'message' }, ({ payload }) => {
      setMessages((prev) => [...prev, payload as ChatMessage])
    })

    // 공감 반응: 각 이벤트는 (message_id, emoji, user_id) 토글
    channel.on('broadcast', { event: 'reaction' }, ({ payload }) => {
      const { message_id, emoji, user_id } = payload as {
        message_id: string
        emoji: string
        user_id: string
      }
      setReactions((prev) => {
        const forMsg = { ...(prev[message_id] ?? {}) }
        const users = new Set(forMsg[emoji] ?? [])
        if (users.has(user_id)) users.delete(user_id)
        else users.add(user_id)
        forMsg[emoji] = [...users]
        return { ...prev, [message_id]: forMsg }
      })
    })

    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState<PresenceMember>()
      const unique = new Map<string, PresenceMember>()
      Object.values(state).forEach((metas) => {
        metas.forEach((m) => unique.set(m.user_id, m))
      })
      setMembers([...unique.values()])
    })

    channel.subscribe(async (s) => {
      if (s === 'SUBSCRIBED') {
        setStatus('joined')
        await channel.track(me)
      } else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') {
        setStatus('error')
      }
    })

    return () => {
      supabase.removeChannel(channel)
      channelRef.current = null
    }
    // me 객체는 페이지에서 useMemo로 안정화됨
  }, [roomId, me])

  const sendMessage = useCallback(
    (text: string) => {
      const channel = channelRef.current
      const trimmed = text.trim()
      if (!channel || !me || !trimmed) return
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        user: me,
        text: trimmed,
        ts: Date.now(),
      }
      channel.send({ type: 'broadcast', event: 'message', payload: msg })
    },
    [me],
  )

  const sendImage = useCallback(
    (imageUrl: string) => {
      const channel = channelRef.current
      if (!channel || !me) return
      const msg: ChatMessage = {
        id: crypto.randomUUID(),
        user: me,
        image_url: imageUrl,
        ts: Date.now(),
      }
      channel.send({ type: 'broadcast', event: 'message', payload: msg })
    },
    [me],
  )

  const toggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      const channel = channelRef.current
      if (!channel || !me) return
      channel.send({
        type: 'broadcast',
        event: 'reaction',
        payload: { message_id: messageId, emoji, user_id: me.user_id },
      })
    },
    [me],
  )

  return { messages, members, reactions, status, sendMessage, sendImage, toggleReaction }
}
