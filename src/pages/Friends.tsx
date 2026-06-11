import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { listFriends, listIncomingRequests, acceptFriendRequest } from '@/lib/friends'
import type { Profile } from '@/lib/database.types'
import { BodolAvatar, Bodol } from '@/components/mascot'
import { Button } from '@/components/ui'
import styles from './Friends.module.css'

type Tab = 'friends' | 'requests'

export function Friends() {
  const navigate = useNavigate()
  const [tab, setTab] = useState<Tab>('friends')
  const [friends, setFriends] = useState<Profile[]>([])
  const [requests, setRequests] = useState<{ friendshipId: string; profile: Profile }[]>([])
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState<string | null>(null)

  const reload = useCallback(async () => {
    setLoading(true)
    try {
      const [f, r] = await Promise.all([listFriends(), listIncomingRequests()])
      setFriends(f)
      setRequests(r)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  async function handleAccept(friendshipId: string) {
    setAccepting(friendshipId)
    try {
      await acceptFriendRequest(friendshipId)
      await reload()
    } finally {
      setAccepting(null)
    }
  }

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.back} onClick={() => navigate('/')} aria-label="뒤로">
          <ChevronLeft size={22} />
        </button>
        <h1>친구</h1>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'friends' ? styles.tabOn : ''}`}
          onClick={() => setTab('friends')}
        >
          내 친구 {friends.length > 0 && `(${friends.length})`}
        </button>
        <button
          className={`${styles.tab} ${tab === 'requests' ? styles.tabOn : ''}`}
          onClick={() => setTab('requests')}
        >
          받은 요청
          {requests.length > 0 && <span className={styles.badge}>{requests.length}</span>}
        </button>
      </div>

      <div className={styles.list}>
        {loading ? (
          <p className={styles.state}>불러오는 중…</p>
        ) : tab === 'friends' ? (
          friends.length === 0 ? (
            <div className={styles.empty}>
              <Bodol size={84} expression="smile" />
              <p>
                아직 친구가 없어요.
                <br />
                채팅방 참여자 목록에서 친구를 추가해 보세요!
              </p>
            </div>
          ) : (
            friends.map((p) => (
              <div key={p.id} className={styles.row}>
                <BodolAvatar size={40} expression={p.avatar_expression} color={p.avatar_color} />
                <span className={styles.name}>{p.nickname}</span>
              </div>
            ))
          )
        ) : requests.length === 0 ? (
          <div className={styles.empty}>
            <Bodol size={84} expression="wink" />
            <p>받은 친구 요청이 없어요.</p>
          </div>
        ) : (
          requests.map(({ friendshipId, profile }) => (
            <div key={friendshipId} className={styles.row}>
              <BodolAvatar
                size={40}
                expression={profile.avatar_expression}
                color={profile.avatar_color}
              />
              <span className={styles.name}>{profile.nickname}</span>
              <Button
                size="md"
                disabled={accepting === friendshipId}
                onClick={() => handleAccept(friendshipId)}
              >
                {accepting === friendshipId ? '수락 중…' : '수락'}
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
