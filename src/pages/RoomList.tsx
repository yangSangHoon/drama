import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { listRooms, getFriendIds } from '@/lib/rooms'
import type { Room } from '@/lib/database.types'
import { computeStatus, isToday, STATUS_ORDER } from '@/lib/roomStatus'
import { BodolAvatar, Bodol } from '@/components/mascot'
import { RoomCard } from '@/components/room/RoomCard'
import styles from './RoomList.module.css'

type Filter = 'all' | 'live' | 'today' | 'friends'

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'live', label: '상영중' },
  { key: 'today', label: '오늘 밤' },
  { key: 'friends', label: '친구방' },
]

export function RoomList() {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()

  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [friendIds, setFriendIds] = useState<Set<string>>(new Set())
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 친구 id 1회 로드
  useEffect(() => {
    getFriendIds().then((ids) => setFriendIds(new Set(ids)))
  }, [])

  // 검색어 변화 시 (디바운스) 방 목록 로드
  useEffect(() => {
    let active = true
    setLoading(true)
    const t = setTimeout(() => {
      listRooms(search)
        .then((data) => {
          if (active) setRooms(data)
        })
        .catch((e) => {
          if (active) setError(e instanceof Error ? e.message : '방 목록을 불러오지 못했어요.')
        })
        .finally(() => {
          if (active) setLoading(false)
        })
    }, 250)
    return () => {
      active = false
      clearTimeout(t)
    }
  }, [search])

  // 메뉴 바깥 클릭 닫기
  useEffect(() => {
    if (!menuOpen) return
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  const visible = useMemo(() => {
    const filtered = rooms.filter((r) => {
      switch (filter) {
        case 'live':
          return computeStatus(r.starts_at) === 'live'
        case 'today':
          return isToday(r.starts_at) && computeStatus(r.starts_at) !== 'end'
        case 'friends':
          return r.host_id != null && friendIds.has(r.host_id)
        default:
          return true
      }
    })
    return filtered.sort((a, b) => {
      const sa = STATUS_ORDER[computeStatus(a.starts_at)]
      const sb = STATUS_ORDER[computeStatus(b.starts_at)]
      if (sa !== sb) return sa - sb
      // 상영중·곧시작: 임박 순 / 종료: 최근 순
      const ta = new Date(a.starts_at).getTime()
      const tb = new Date(b.starts_at).getTime()
      return sa === STATUS_ORDER.end ? tb - ta : ta - tb
    })
  }, [rooms, filter, friendIds])

  return (
    <div className={styles.list}>
      <div className={styles.head}>
        <div className={styles.hi}>
          오늘 뭐 <span>같이 볼래?</span>
        </div>
        <div className={styles.menuWrap} ref={menuRef}>
          <button
            className={styles.avatarBtn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="내 메뉴"
          >
            {profile && (
              <BodolAvatar
                size={38}
                expression={profile.avatar_expression}
                color={profile.avatar_color}
              />
            )}
          </button>
          {menuOpen && (
            <div className={styles.menu}>
              <div className={styles.menuName}>{profile?.nickname}</div>
              <Link to="/design" className={styles.menuItem} onClick={() => setMenuOpen(false)}>
                디자인 시스템
              </Link>
              <button className={styles.menuItem} onClick={() => signOut()}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.search}>
        <Search className={styles.searchIc} size={17} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="드라마 제목으로 검색"
          aria-label="드라마 제목 검색"
        />
      </div>

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`${styles.f} ${filter === f.key ? styles.on : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.scroll}>
        {loading ? (
          <div className={styles.state}>불러오는 중…</div>
        ) : error ? (
          <div className={styles.state}>{error}</div>
        ) : visible.length === 0 ? (
          <div className={styles.empty}>
            <Bodol size={88} expression="surprise" />
            <p>
              {search || filter !== 'all'
                ? '조건에 맞는 방이 없어요'
                : '아직 열린 방이 없어요.\n첫 방을 만들어 볼까요?'}
            </p>
          </div>
        ) : (
          visible.map((room) => <RoomCard key={room.id} room={room} />)
        )}
      </div>

      <button
        className={styles.fab}
        onClick={() => navigate('/rooms/new')}
        aria-label="방 만들기"
      >
        <Plus size={24} strokeWidth={2.5} />
      </button>
    </div>
  )
}
