interface KakaoSDK {
  init: (key: string) => void
  isInitialized: () => boolean
  Share: { sendDefault: (settings: Record<string, unknown>) => void }
}

declare global {
  interface Window {
    Kakao?: KakaoSDK
  }
}

const KAKAO_KEY = import.meta.env.VITE_KAKAO_JS_KEY
const SDK_URL = 'https://t1.kakaocdn.net/kakao_js_sdk/2.7.4/kakao.min.js'

let loadPromise: Promise<void> | null = null

/** Kakao 공유 사용 가능 여부 (JS 키 설정됐는지) */
export function kakaoAvailable(): boolean {
  return !!KAKAO_KEY
}

function loadSdk(): Promise<void> {
  if (window.Kakao) return Promise.resolve()
  if (loadPromise) return loadPromise
  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = SDK_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Kakao SDK 로드에 실패했어요.'))
    document.head.appendChild(script)
  })
  return loadPromise
}

export interface KakaoShareOptions {
  title: string
  description: string
  link: string
  /** 절대 URL(http/https). 없으면 텍스트 템플릿으로 공유 */
  imageUrl?: string
}

/**
 * Kakao.Share.sendDefault 로 방 링크 공유.
 * CSR이라 OG 크롤링이 안 되는 걸 Kakao SDK로 우회 (CLAUDE.md §3.2).
 */
export async function shareKakao(opts: KakaoShareOptions): Promise<void> {
  if (!KAKAO_KEY) throw new Error('Kakao JS 키(VITE_KAKAO_JS_KEY)가 설정되지 않았어요.')
  await loadSdk()
  const Kakao = window.Kakao!
  if (!Kakao.isInitialized()) Kakao.init(KAKAO_KEY)

  const linkObj = { mobileWebUrl: opts.link, webUrl: opts.link }

  if (opts.imageUrl) {
    Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: opts.title,
        description: opts.description,
        imageUrl: opts.imageUrl,
        link: linkObj,
      },
      buttons: [{ title: '같이 보러 가기', link: linkObj }],
    })
  } else {
    Kakao.Share.sendDefault({
      objectType: 'text',
      text: `${opts.title}\n${opts.description}`,
      link: linkObj,
      buttonTitle: '같이 보러 가기',
    })
  }
}
