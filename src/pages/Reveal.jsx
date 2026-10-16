import React, { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { PartyPopper, Share2 } from 'lucide-react'
import { fmt, useAuth, FINAL_THRESHOLD } from '../store.jsx'

export default function Reveal() {
  const { user, updateUser, resetProgress } = useAuth()
  const nav = useNavigate()
  const [accepted, setAccepted] = useState(false)
  const [msg, setMsg] = useState('')
  const pieces = useMemo(() => Array.from({ length: 36 }, (_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 2.2, dur: 3 + Math.random() * 2.5,
    color: ['#F2B705', '#FFD95E', '#B88300', '#FFFFFF'][i % 4], rot: Math.random() * 360,
  })), [])

  const allowed = user.stage === 'done' || (user.stage === 'raised' && user.balance >= FINAL_THRESHOLD)
  if (!allowed) return <Navigate to="/portefeuille" replace />

  const missions = Object.keys(user.done).length
  const minutes = Math.max(1, Math.round((Date.now() - user.createdAt) / 60000))

  const share = async () => {
    const url = window.location.origin
    const text = 'Je me suis fait avoir par VolaBe. Essaie, toi aussi 😂'
    try {
      if (navigator.share) await navigator.share({ title: 'VolaBe', text, url })
      else { await navigator.clipboard.writeText(`${text} ${url}`); setMsg('Lien copié. À toi de piéger un ami.') }
    } catch { /* annulé */ }
  }

  return (
    <div className="reveal">
      <div className="confetti" aria-hidden>
        {pieces.map((p, i) => <i key={i} style={{ left: p.left + '%', animationDelay: p.delay + 's', animationDuration: p.dur + 's', background: p.color, transform: `rotate(${p.rot}deg)` }} />)}
      </div>
      <div className="reveal-card">
        <span className="win-ico big"><PartyPopper size={34} /></span>
        <h1>Félicitations !</h1>
        <p className="r-lead">Tu viens de gagner…</p>
        <div className="r-prize">toute notre considération 😂 "Grizzly te remercie "</div>
        <p>VolaBe n’a jamais versé un seul ariary. Les {fmt(user.balance)} affichés n’existaient que dans ton navigateur : c’était un prank.</p>
        <div className="r-stats">
          <div><b>{missions}</b><span>missions réussies</span></div>
          <div><b>{minutes} min</b><span>depuis l’inscription</span></div>
          <div><b>0 Ar</b><span>versés</span></div>
        </div>
        <p className="r-safe">Les informations saisies pour le retrait n’ont été ni enregistrées ni envoyées. Ton compte reste uniquement sur ton téléphone, et tu peux le supprimer depuis ton profil.</p>
        {!accepted ? (
          <button className="btn btn-gold btn-block big" onClick={() => setAccepted(true)}>J’ai vraiment cru que j’allais devenir riche</button>
        ) : (
          <div className="r-badge">Victime certifiée VolaBe. Respect pour le courage.</div>
        )}
        <button className="btn btn-ghost btn-block" onClick={share}><Share2 size={16} /> Piéger un ami</button>
        {msg && <p className="hint">{msg}</p>}
        <div className="row-gap">
          <button className="btn btn-text" onClick={() => { resetProgress(); nav('/missions') }}>Recommencer</button>
          <button className="btn btn-text" onClick={() => nav('/profil')}>Mon profil</button>
        </div>
      </div>
    </div>
  )
}
