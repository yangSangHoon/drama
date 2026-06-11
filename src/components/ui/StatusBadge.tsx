import styles from './StatusBadge.module.css'

/** 방 상태: 상영중 / 곧 시작 / 종료 */
export type RoomStatus = 'live' | 'soon' | 'end'

const LABEL: Record<RoomStatus, string> = {
  live: '상영중',
  soon: '곧 시작',
  end: '종료',
}

export function StatusBadge({ status }: { status: RoomStatus }) {
  return (
    <span className={`${styles.bd} ${styles[status]}`}>
      <span className={styles.dot} />
      {LABEL[status]}
    </span>
  )
}
