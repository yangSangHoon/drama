import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { createRoom } from '@/lib/rooms'
import { formatRoomTime } from '@/lib/roomStatus'
import { Button } from '@/components/ui'
import styles from './CreateRoom.module.css'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

/** Date → datetime-local input 값 (로컬 시간 "YYYY-MM-DDTHH:mm") */
function toLocalInput(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/** 기본 시작 시간: 다음 정각 */
function defaultStart(): string {
  const d = new Date()
  d.setHours(d.getHours() + 1, 0, 0, 0)
  return toLocalInput(d)
}

export function CreateRoom() {
  const navigate = useNavigate()

  const [dramaTitle, setDramaTitle] = useState('')
  const [episode, setEpisode] = useState('')
  const [startsAt, setStartsAt] = useState(defaultStart)
  const [description, setDescription] = useState('')
  const [spoilerOk, setSpoilerOk] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const valid = dramaTitle.trim().length > 0 && startsAt.length > 0

  // 자동 생성 방 제목 미리보기
  const preview = useMemo(() => {
    const t = dramaTitle.trim() || '드라마 제목'
    const title = [t, episode.trim()].filter(Boolean).join(' ')
    let when = ''
    try {
      if (startsAt) when = formatRoomTime(new Date(startsAt).toISOString())
    } catch {
      when = ''
    }
    return when ? `${title} · ${when}` : title
  }, [dramaTitle, episode, startsAt])

  async function handleSubmit() {
    if (!valid || submitting) return
    setError(null)
    setSubmitting(true)
    try {
      const room = await createRoom({
        drama_title: dramaTitle.trim(),
        episode: episode.trim() || null,
        starts_at: new Date(startsAt).toISOString(),
        description: description.trim() || null,
        spoiler_ok: spoilerOk,
      })
      navigate(`/rooms/${room.id}`, { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : '방을 만들지 못했어요.')
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate(-1)} aria-label="뒤로">
          <ChevronLeft size={22} />
        </button>
        <h1>방 만들기</h1>
      </header>

      <div className={styles.preview}>
        <div className={styles.previewLabel}>방 제목 미리보기</div>
        <div className={styles.previewTitle}>{preview}</div>
      </div>

      <label className={styles.field}>
        <span className={styles.label}>드라마 제목 *</span>
        <input
          className={styles.input}
          value={dramaTitle}
          onChange={(e) => setDramaTitle(e.target.value)}
          placeholder="선재 업고 튀어"
          maxLength={60}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>회차</span>
        <input
          className={styles.input}
          value={episode}
          onChange={(e) => setEpisode(e.target.value)}
          placeholder="5화"
          maxLength={20}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>시청 시작 시간 *</span>
        <input
          className={styles.input}
          type="datetime-local"
          value={startsAt}
          onChange={(e) => setStartsAt(e.target.value)}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>방 설명</span>
        <textarea
          className={styles.textarea}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="1화부터 정주행 / 명장면 위주 / 맥주 필수 등"
          rows={2}
          maxLength={100}
        />
      </label>

      <div className={styles.field}>
        <span className={styles.label}>스포일러</span>
        <div className={styles.toggleRow}>
          <button
            type="button"
            className={`${styles.toggle} ${spoilerOk ? styles.toggleOn : ''}`}
            onClick={() => setSpoilerOk(true)}
          >
            스포 OK
          </button>
          <button
            type="button"
            className={`${styles.toggle} ${!spoilerOk ? styles.toggleOn : ''}`}
            onClick={() => setSpoilerOk(false)}
          >
            스포 금지
          </button>
        </div>
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}

      <div className={styles.footer}>
        <Button size="lg" block disabled={!valid || submitting} onClick={handleSubmit}>
          {submitting ? '만드는 중…' : '방 만들기'}
        </Button>
      </div>
    </div>
  )
}
