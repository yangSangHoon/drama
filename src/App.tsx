import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DesignSystem } from '@/pages/DesignSystem'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* M1: 디자인 시스템 쇼케이스. 이후 마일스톤에서 실제 라우트로 교체 */}
        <Route path="/design" element={<DesignSystem />} />
        <Route path="/" element={<Navigate to="/design" replace />} />
        <Route path="*" element={<Navigate to="/design" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
