import { useNavigate } from 'react-router-dom'
import { ShieldOff } from 'lucide-react'
import type { Room } from '@/lib/database.types'
import { StatusBadge } from '@/components/ui'
import { computeStatus, formatRoomTime, posterColor } from '@/lib/roomStatus'
import styles from './RoomCard.module.css'

export function RoomCard({ room }: { room: Room }) {
  const navigate = useNavigate()
  const status = computeStatus(room.starts_at)
  const poster = posterColor(room.drama_title)
  const initial = room.drama_title.trim().charAt(0) || '?'

  const title = [room.drama_title, room.episode].filter(Boolean).join(' ')
  const metaParts = [formatRoomTime(room.starts_at)]
  if (room.description) metaParts.push(room.description)
  const meta = metaParts.join(' · ')

  return (
    <button
      type="button"
      className={styles.room}
      onClick={() => navigate(`/rooms/${room.id}`)}
      aria-label={`${title} 채팅방 입장`}
    >
      <div className={styles.poster} style={{ background: poster.bg, color: poster.fg }}>
        {initial}
      </div>
      <div className={styles.info}>
        <div className={styles.title}>{title}</div>
        <div className={styles.meta}>{meta}</div>
        <div className={styles.row2}>
          <StatusBadge status={status} />
          {!room.spoiler_ok && (
            <span className={styles.spoiler}>
              <ShieldOff size={12} />
              스포 금지
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
