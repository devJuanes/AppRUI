import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AnalyticsListener } from './components/AnalyticsListener'
import { HomePage } from './pages/HomePage'
import { ResultadoPage } from './pages/ResultadoPage'

export default function App() {
  return (
    <BrowserRouter>
      <AnalyticsListener />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/resultado/:documento" element={<ResultadoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
