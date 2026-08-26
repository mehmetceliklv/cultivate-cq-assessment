import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssessmentPage from './pages/AssessmentPage'
import AdminPage from './pages/AdminPage'
import InsightsPage from './pages/InsightsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssessmentPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </BrowserRouter>
  )
}
