import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft, Users, Clock, Camera, Send, Share2, X } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { getRoom } from '@/lib/rooms'
import type { Room } from '@/lib/database.types'
import { computeStatus, formatRoomTime, formatSyncTime } from '@/lib/roomStatus'
import { useRoomChannel, type ChatUser } from '@/hooks/useRoomChannel'
import { BodolAvatar, Bodol } from '@/components/mascot'
import { LoadingScreen } from '@/components/ui'
import styles from './ChatRoom.module.css'

export function ChatRoom() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile, user } = useAuth()

  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [input, setInput] = useState('')
  const [showMembers, setShowMembers] = useState(false)
  const [now, setNow] = useState(() => Date.now())

  const msgEndRef = useRef<HTMLDivElement>(null)

  // 내 정보 (채널 track용) — 프로필 바뀌지 않는 한 ref 안정
  const me = useMemo<ChatUser | null>(() => {
    if (!user || !profile) return null
    return {
      user_id: user.id,
      nickname: profile.nickname,
      expression: profile.avatar_expression,
      color: profile.avatar_color,
    }
  }, [user, profile])

  const { messages, members, status, sendMessage } = useRoomChannel(id, me)

  // 방 정보 로드
  useEffect(() => {
    if (!id) return
    setLoading(true)
    getRoom(id)
      .then((r) => (r ? setRoom(r) : setNotFound(true)))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  // 싱크 타이머 1초 틱
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [])

  // 새 메시지 시 맨 아래로 스크롤
  useEffect(() => {
    msgEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  if (loading) return <LoadingScreen message="채팅방 입장 중…" />

  if (notFound || !room) {
    return (
      <div className={styles.notFound}>
        <Bodol size={96} expression="cry" />
        <p>방을 찾을 수 없어요</p>
        <button className={styles.backText} onClick={() => navigate('/')}>
          목록으로
        </button>
      </div>
    )
  }

  const roomStatus = computeStatus(room.starts_at, now)
  const title = [room.drama_title, room.episode].filter(Boolean).join(' ')
  const fullTitle = `${title} · ${formatRoomTime(room.starts_at, new Date(now))}`

  const syncLabel =
    roomStatus === 'soon'
      ? '곧 시작해요'
      : roomStatus === 'end'
        ? '종료된 방이에요'
        : '다 같이 재생 위치 맞추는 중'
  const syncTime = roomStatus === 'end' ? '' : formatSyncTime(room.starts_at, now)

  function handleSend() {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
  }

  return (
    <div className={styles.chat}>
      {/* 헤더 */}
      <div className={styles.head}>
        <div className={styles.headTop}>
          <button className={styles.iconBtn} onClick={() => navigate('/')} aria-label="목록으로">
            <ChevronLeft size={20} />
          </button>
          <span className={styles.name}>{fullTitle}</span>
          <button
            className={styles.iconBtn}
            disabled
            title="링크 공유는 M6에서 지원돼요"
            aria-label="링크 공유"
          >
            <Share2 size={18} />
          </button>
          <button
            className={styles.iconBtn}
            onClick={() => setShowMembers(true)}
            aria-label="참여자 보기"
          >
            <Users size={18} />
          </button>
        </div>
        <div className={styles.sub}>
          <span className={`${styles.liveDot} ${roomStatus !== 'live' ? styles.dimDot : ''}`} />
          {members.length > 0 ? `${members.length}명이 같이 보는 중` : '입장 중…'} ·{' '}
          {room.spoiler_ok ? '스포 OK 방' : '스포 금지 방'}
          {status === 'error' && <span className={styles.err}> · 연결 끊김</span>}
        </div>
      </div>

      {/* 싱크 타이머 */}
      <div className={styles.sync}>
        <Clock size={16} className={styles.syncIc} />
        <span className={styles.syncText}>{syncLabel}</span>
        {syncTime && <span className={styles.syncTime}>{syncTime}</span>}
      </div>

      {/* 메시지 */}
      <div className={styles.msgs}>
        {messages.length === 0 ? (
          <div className={styles.hint}>
            아직 아무 말이 없어요.
            <br />
            먼저 인사를 건네볼까요? 👋
          </div>
        ) : (
          messages.map((m) => {
            const mine = m.user.user_id === me?.user_id
            return (
              <div key={m.id} className={`${styles.msg} ${mine ? styles.me : ''}`}>
                <BodolAvatar
                  className={styles.avatar}
                  size={34}
                  expression={m.user.expression}
                  color={m.user.color}
                />
                <div className={styles.msgBody}>
                  {!mine && <div className={styles.nick}>{m.user.nickname}</div>}
                  {m.text && <div className={styles.bubble}>{m.text}</div>}
                </div>
              </div>
            )
          })
        )}
        <div ref={msgEndRef} />
      </div>

      {/* 입력 */}
      <div className={styles.inputBar}>
        <button
          className={styles.ciBtn}
          disabled
          title="이미지 첨부는 M5에서 지원돼요"
          aria-label="이미지 첨부"
        >
          <Camera size={18} />
        </button>
        <input
          className={styles.ciField}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) handleSend()
          }}
          placeholder="같이 떠들어요…"
          disabled={status !== 'joined'}
        />
        <button
          className={styles.ciSend}
          onClick={handleSend}
          disabled={!input.trim() || status !== 'joined'}
          aria-label="보내기"
        >
          <Send size={17} />
        </button>
      </div>

      {/* 참여자 시트 */}
      {showMembers && (
        <div className={styles.sheetBackdrop} onClick={() => setShowMembers(false)}>
          <div className={styles.sheet} onClick={(e) => e.stopPropagation()}>
            <div className={styles.sheetHead}>
              <h3>참여자 {members.length}</h3>
              <button className={styles.iconBtn} onClick={() => setShowMembers(false)} aria-label="닫기">
                <X size={20} />
              </button>
            </div>
            <div className={styles.memberList}>
              {members.length === 0 ? (
                <p className={styles.hint}>아직 참여자를 불러오는 중…</p>
              ) : (
                members.map((mem) => (
                  <div key={mem.user_id} className={styles.member}>
                    <BodolAvatar size={36} expression={mem.expression} color={mem.color} />
                    <span className={styles.memberName}>
                      {mem.nickname}
                      {mem.user_id === me?.user_id && ' (나)'}
                    </span>
                    {mem.user_id === room.host_id && <span className={styles.hostBadge}>방장</span>}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
