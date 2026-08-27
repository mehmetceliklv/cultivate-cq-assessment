import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AssessmentPage from './pages/AssessmentPage'

const AdminPage = lazy(() => import('./pages/AdminPage'))
const InsightsPage = lazy(() => import('./pages/InsightsPage'))

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 via-slate-50 to-emerald-50/60">
      <p className="text-slate-500">Loading…</p>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AssessmentPage />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<RouteFallback />}>
              <AdminPage />
            </Suspense>
          }
        />
        <Route
          path="/insights"
          element={
            <Suspense fallback={<RouteFallback />}>
              <InsightsPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
