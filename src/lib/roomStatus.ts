import type { RoomStatus } from '@/components/ui'

/** 방 지속 시간: 시작 + 2시간 경과 시 "종료" (스펙 §6) */
export const ROOM_DURATION_MS = 2 * 60 * 60 * 1000

/** starts_at(ISO) 기준 방 상태 계산 */
export function computeStatus(startsAtISO: string, nowMs: number = Date.now()): RoomStatus {
  const start = new Date(startsAtISO).getTime()
  if (nowMs < start) return 'soon'
  if (nowMs < start + ROOM_DURATION_MS) return 'live'
  return 'end'
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

/** "오늘 22:00" / "내일 21:30" / "토요일 20:00" / "8월 3일 19:00" */
export function formatRoomTime(startsAtISO: string, now: Date = new Date()): string {
  const d = new Date(startsAtISO)
  const dayDiff = Math.round((startOfDay(d) - startOfDay(now)) / 86_400_000)

  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const time = `${hh}:${mm}`

  let day: string
  if (dayDiff === 0) day = '오늘'
  else if (dayDiff === 1) day = '내일'
  else if (dayDiff === -1) day = '어제'
  else if (dayDiff > 1 && dayDiff < 7) day = `${WEEKDAYS[d.getDay()]}요일`
  else day = `${d.getMonth() + 1}월 ${d.getDate()}일`

  return `${day} ${time}`
}

/** 같은 로컬 날짜(오늘)인지 — "오늘 밤" 필터용 */
export function isToday(startsAtISO: string, now: Date = new Date()): boolean {
  return startOfDay(new Date(startsAtISO)) === startOfDay(now)
}

/** 리스트 정렬 우선순위: 상영중 → 곧 시작 → 종료 */
export const STATUS_ORDER: Record<RoomStatus, number> = { live: 0, soon: 1, end: 2 }

/** 포스터 배경/글자 색 (드라마 제목 해시로 안정적으로 선택) */
const POSTER_PALETTE: { bg: string; fg: string }[] = [
  { bg: '#FFE3DD', fg: '#FF6B57' }, // coral
  { bg: '#EEEBFF', fg: '#9B8CFF' }, // lavender
  { bg: '#FFF3D4', fg: '#C8902A' }, // butter
  { bg: '#E2F6EF', fg: '#3BAA8C' }, // mint
  { bg: '#EAF1FF', fg: '#5B8DEF' }, // sky
  { bg: '#FBEAF3', fg: '#D464A6' }, // pink
]

export function posterColor(title: string): { bg: string; fg: string } {
  let hash = 0
  for (let i = 0; i < title.length; i++) {
    hash = (hash * 31 + title.charCodeAt(i)) | 0
  }
  return POSTER_PALETTE[Math.abs(hash) % POSTER_PALETTE.length]
}
