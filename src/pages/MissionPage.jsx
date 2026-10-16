import React, { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import Challenge from '../components/Challenges.jsx'
import { MISSIONS, missionById } from '../missions.js'
import { fmt, threshold, useAuth } from '../store.jsx'

export default function MissionPage() {
  const { id } = useParams()
  const m = missionById(id)
  const { user, completeMission } = useAuth()
  const nav = useNavigate()
  const [won, setWon] = useState(false)

  if (!m) return <Navigate to="/missions" replace />
  const already = !!user.done[m.id] && !won
  const Icon = m.icon

  const onDone = (thumb) => {
    if (user.done[m.id]) return
    completeMission(m, thumb)
    setWon(true)
  }

  const next = MISSIONS.find((x) => x.id !== m.id && !user.done[x.id])
  const canWithdraw = user.balance >= threshold(user)

  return (
    <div className="page narrow">
      <Link to="/missions" className="back"><ArrowLeft size={16} /> Missions</Link>
      <div className="mhead">
        <span className="mico lg"><Icon size={26} /></span>
        <div>
          <h1>{m.title}</h1>
          <p className="meta">{m.level} · {m.time}</p>
        </div>
        <span className="mreward lg">+{fmt(m.reward)}</span>
      </div>
      <p className="mtext">{m.text}</p>

      {won ? (
        <div className="win">
          <span className="win-ico"><Check size={30} strokeWidth={3} /></span>
          <h2>Mission validée</h2>
          <div className="win-amount">+{fmt(m.reward)}</div>
          <p>Nouveau solde : <b>{fmt(user.balance)}</b></p>
          {canWithdraw ? (
            <Link to="/portefeuille" className="btn btn-gold btn-block big">Demander mon retrait</Link>
          ) : next ? (
            <Link to={`/missions/${next.id}`} className="btn btn-gold btn-block big">Mission suivante</Link>
          ) : null}
          <button className="btn btn-ghost btn-block" onClick={() => nav('/missions')}>Retour aux missions</button>
          {canWithdraw && next && <Link to={`/missions/${next.id}`} className="btn btn-text">Continuer les missions</Link>}
        </div>
      ) : already ? (
        <div className="win done">
          <span className="win-ico"><Check size={30} strokeWidth={3} /></span>
          <h2>Déjà terminée</h2>
          <p>Cette mission t’a rapporté {fmt(m.reward)}.</p>
          <button className="btn btn-gold btn-block" onClick={() => nav('/missions')}>Choisir une autre mission</button>
        </div>
      ) : (
        <Challenge key={m.id} mission={m} onDone={onDone} />
      )}
    </div>
  )
}
