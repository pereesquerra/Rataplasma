import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Home from './pages/Home'
import Login from './pages/Login'
import Parla from './pages/Parla'
import Musica from './pages/Musica'
import Codi from './pages/Codi'
import Admin from './pages/Admin'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        className="min-h-screen h-full"
        initial={{ opacity: 0, x: 32, rotate: 0.7 }}
        animate={{ opacity: 1, x: 0, rotate: 0 }}
        exit={{ opacity: 0, x: -28, rotate: -0.7 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parla"
            element={
              <ProtectedRoute>
                <Parla />
              </ProtectedRoute>
            }
          />
          <Route
            path="/musica"
            element={
              <ProtectedRoute>
                <Musica />
              </ProtectedRoute>
            }
          />
          <Route
            path="/codi"
            element={
              <ProtectedRoute>
                <Codi />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}
