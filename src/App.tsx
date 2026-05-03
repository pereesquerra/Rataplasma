import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { getSession } from '@/lib/auth'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Parla from '@/pages/Parla'
import Musica from '@/pages/Musica'
import Codi from '@/pages/Codi'
import Laboratori from '@/pages/Laboratori'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  if (!getSession()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/parla"
        element={(
          <ProtectedRoute>
            <Parla />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/musica"
        element={(
          <ProtectedRoute>
            <Musica />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/codi"
        element={(
          <ProtectedRoute>
            <Codi />
          </ProtectedRoute>
        )}
      />
      <Route
        path="/laboratori"
        element={(
          <ProtectedRoute>
            <Laboratori />
          </ProtectedRoute>
        )}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
