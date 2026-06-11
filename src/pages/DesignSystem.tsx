import { Search, Send, Plus, Share2, UserPlus } from 'lucide-react'
import { Bodol, BodolAvatar, BODOL_COLORS, BODOL_EXPRESSIONS, BODOL_EXPRESSION_LABEL, BODOL_COLOR_LABEL } from '@/components/mascot'
import { Button, StatusBadge } from '@/components/ui'
import styles from './DesignSystem.module.css'

const PALETTE: { name: string; varName: string; hex: string; role: string }[] = [
  { name: '코랄', varName: '--coral', hex: '#FF6B57', role: '메인' },
  { name: '라벤더', varName: '--lavender', hex: '#9B8CFF', role: '보조' },
  { name: '버터', varName: '--butter', hex: '#FFD66B', role: '강조' },
  { name: '민트', varName: '--mint', hex: '#5ED5B8', role: '포인트' },
  { name: '크림', varName: '--cream', hex: '#FFF6EE', role: '배경' },
  { name: '나이트', varName: '--night', hex: '#241F33', role: '극장모드' },
]

export function DesignSystem() {
  return (
    <div className={styles.page}>
      <header className={styles.docHeader}>
        <div className={styles.logo}>
          <Bodol size={44} title="같이볼래 로고" />
          같이볼래<span className={styles.dot}>?</span>
        </div>
        <p>혼자 보는 드라마, 같이 보는 기분 — 동시시청 채팅 서비스</p>
        <span className={styles.tag}>M1 · 디자인 시스템 컴포넌트</span>
      </header>

      {/* 컬러 */}
      <h2 className={styles.sectionTitle}>컬러 팔레트</h2>
      <div className={styles.swatches}>
        {PALETTE.map((c) => (
          <div key={c.varName} className={styles.sw}>
            <div className={styles.chip} style={{ background: c.hex }} />
            <b>{c.name}</b>
            <small>
              {c.hex}
              <br />
              {c.role}
            </small>
          </div>
        ))}
      </div>

      {/* 타이포 */}
      <h2 className={styles.sectionTitle}>타이포그래피 · Pretendard</h2>
      <div className={styles.card}>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>H1 / 800</span>
          <span style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.5px' }}>같이볼래?</span>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>H2 / 700</span>
          <span style={{ fontSize: 17, fontWeight: 700 }}>채팅방 제목</span>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>Body / 400</span>
          <span style={{ fontSize: 14 }}>본문은 편안하게 읽혀요</span>
        </div>
        <div className={styles.typeRow}>
          <span className={styles.typeLabel}>Caption / 500</span>
          <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>시간 · 인원 같은 보조 정보</span>
        </div>
      </div>

      {/* 마스코트 */}
      <h2 className={styles.sectionTitle}>마스코트 · 보돌이</h2>
      <div className={styles.card}>
        <div className={styles.mascotRow}>
          <Bodol size={92} title="보돌이" />
          <div className={styles.mascotDesc}>
            <b>"같이 보돌이"</b>
            말랑한 TV 모양 캐릭터.
            <br />
            로고 · 로딩 · 빈 화면 · 아바타에 일관되게 사용해요.
          </div>
        </div>

        <div className={styles.subLabel}>전신 표정 6종</div>
        <div className={styles.faceRow}>
          {BODOL_EXPRESSIONS.map((e) => (
            <div key={e} className={styles.faceItem}>
              <Bodol size={56} expression={e} />
              <small>{BODOL_EXPRESSION_LABEL[e]}</small>
            </div>
          ))}
        </div>

        <div className={styles.subLabel}>아바타 — 표정 6종 (라벤더)</div>
        <div className={styles.avaRow}>
          {BODOL_EXPRESSIONS.map((e) => (
            <BodolAvatar key={e} size={44} expression={e} color="lavender" title={BODOL_EXPRESSION_LABEL[e]} />
          ))}
        </div>

        <div className={styles.subLabel}>아바타 — 컬러 5종 (윙크)</div>
        <div className={styles.avaRow}>
          {BODOL_COLORS.map((c) => (
            <BodolAvatar key={c} size={44} expression="wink" color={c} title={BODOL_COLOR_LABEL[c]} />
          ))}
        </div>
      </div>

      {/* 버튼 */}
      <h2 className={styles.sectionTitle}>버튼</h2>
      <div className={styles.card}>
        <div className={styles.btnRow}>
          <Button>기본</Button>
          <Button variant="secondary">보조</Button>
          <Button variant="ghost">고스트</Button>
          <Button leftIcon={<Plus size={16} strokeWidth={2.5} />}>방 만들기</Button>
        </div>
        <div className={styles.btnRow}>
          <Button size="lg" leftIcon={<Share2 size={18} />}>
            링크 공유
          </Button>
          <Button size="lg" variant="secondary" leftIcon={<UserPlus size={18} />}>
            친구 초대
          </Button>
        </div>
        <div style={{ marginTop: 14 }}>
          <Button size="lg" block leftIcon={<Send size={18} />}>
            시작하기
          </Button>
        </div>
      </div>

      {/* 뱃지 + 아이콘 */}
      <h2 className={styles.sectionTitle}>상태 뱃지 & 라인 아이콘</h2>
      <div className={styles.card}>
        <div className={styles.btnRow}>
          <StatusBadge status="live" />
          <StatusBadge status="soon" />
          <StatusBadge status="end" />
        </div>
        <div className={styles.subLabel}>아이콘 (lucide-react · 2px stroke)</div>
        <div className={styles.iconRow}>
          <Search size={22} />
          <Send size={22} />
          <Plus size={22} />
          <Share2 size={22} />
          <UserPlus size={22} />
        </div>
      </div>
    </div>
  )
}
