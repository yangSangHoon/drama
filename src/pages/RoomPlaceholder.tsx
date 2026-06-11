import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { getRoom } from '@/lib/rooms'
import type { Room } from '@/lib/database.types'
import { computeStatus, formatRoomTime } from '@/lib/roomStatus'
import { Bodol } from '@/components/mascot'
import { StatusBadge, Button } from '@/components/ui'
import styles from './RoomPlaceholder.module.css'

/** M4에서 극장모드 채팅방으로 교체될 임시 방 상세 페이지 */
export function RoomPlaceholder() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    getRoom(id)
      .then((r) => {
        if (r) setRoom(r)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [id])

  return (
    <div className={styles.page}>
      <button className={styles.back} onClick={() => navigate('/')} aria-label="목록으로">
        <ChevronLeft size={22} />
      </button>

      <div className={styles.body}>
        {loading ? (
          <p className={styles.muted}>불러오는 중…</p>
        ) : notFound || !room ? (
          <>
            <Bodol size={96} expression="cry" />
            <p className={styles.muted}>방을 찾을 수 없어요</p>
            <Button variant="secondary" onClick={() => navigate('/')}>
              목록으로
            </Button>
          </>
        ) : (
          <>
            <Bodol size={96} expression="wink" />
            <h1 className={styles.title}>
              {[room.drama_title, room.episode].filter(Boolean).join(' ')}
            </h1>
            <div className={styles.meta}>
              <StatusBadge status={computeStatus(room.starts_at)} />
              <span>{formatRoomTime(room.starts_at)}</span>
            </div>
            {room.description ? <p className={styles.desc}>{room.description}</p> : null}
            <p className={styles.note}>
              채팅방(극장모드)은 M4에서 만들어질 예정이에요.
              <br />
              지금은 방 정보까지만 확인할 수 있어요.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
