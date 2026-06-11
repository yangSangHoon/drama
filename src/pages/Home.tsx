import { Link } from 'react-router-dom'
import { BodolAvatar } from '@/components/mascot'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui'
import styles from './Home.module.css'

/** M3에서 방 리스트로 교체될 임시 홈 (인증 플로우 확인용) */
export function Home() {
  const { profile, signOut } = useAuth()
  if (!profile) return null

  return (
    <div className={styles.home}>
      <BodolAvatar size={84} expression={profile.avatar_expression} color={profile.avatar_color} />
      <h1>
        반가워요, <span>{profile.nickname}</span>님!
      </h1>
      <p className={styles.sub}>
        로그인과 프로필 설정이 끝났어요.
        <br />
        방 리스트(M3)는 곧 만들어질 예정이에요.
      </p>
      <div className={styles.links}>
        <Link to="/design">
          <Button variant="secondary">디자인 시스템 보기</Button>
        </Link>
        <Button variant="ghost" onClick={() => signOut()}>
          로그아웃
        </Button>
      </div>
    </div>
  )
}
