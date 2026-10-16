import React, { useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { Header, BottomNav } from './components/Common.jsx'
import { useAuth } from './store.jsx'
import Landing from './pages/Landing.jsx'
import { Login, Register } from './pages/Auth.jsx'
import Missions from './pages/Missions.jsx'
import MissionPage from './pages/MissionPage.jsx'
import WalletPage from './pages/WalletPage.jsx'
import Withdraw from './pages/Withdraw.jsx'
import Reveal from './pages/Reveal.jsx'
import Profile from './pages/Profile.jsx'

function Private({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/connexion" replace />
}
function Guest({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/missions" replace /> : children
}

export default function App() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Guest><Landing /></Guest>} />
          <Route path="/inscription" element={<Guest><Register /></Guest>} />
          <Route path="/connexion" element={<Guest><Login /></Guest>} />
          <Route path="/missions" element={<Private><Missions /></Private>} />
          <Route path="/missions/:id" element={<Private><MissionPage /></Private>} />
          <Route path="/portefeuille" element={<Private><WalletPage /></Private>} />
          <Route path="/retrait" element={<Private><Withdraw /></Private>} />
          <Route path="/revelation" element={<Private><Reveal /></Private>} />
          <Route path="/profil" element={<Private><Profile /></Private>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
    </div>
  )
}
