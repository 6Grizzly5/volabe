import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Check, Lock } from 'lucide-react'
import { Banknote } from '../components/Common.jsx'
import { fmt, threshold, useAuth } from '../store.jsx'

export default function WalletPage() {
  const { user, updateUser } = useAuth()
  const nav = useNavigate()
  const goal = threshold(user)
  const ready = user.balance >= goal
  const pct = Math.min(100, (user.balance / goal) * 100)

  const withdraw = () => {
    if (!ready) return
    if (user.stage === 'start') nav('/retrait')
    else { updateUser({ stage: 'done' }); nav('/revelation') }
  }

  return (
    <div className="page">
      <h1 className="ptitle">Portefeuille</h1>
      <div className="wallet-grid">
        <Banknote amount={fmt(user.balance)} name={user.name} />
        <section className="card">
          <h2>Retrait</h2>
          <div className="row-between"><span>Minimum requis</span><b>{fmt(goal)}</b></div>
          <div className="bar wide"><i style={{ width: pct + '%' }} /></div>
          <p className="muted">{ready ? 'Ton solde est suffisant.' : `Il te manque ${fmt(goal - user.balance)}.`}</p>
          <button className="btn btn-gold btn-block big" disabled={!ready} onClick={withdraw}>
            {!ready && <Lock size={16} />} Demander mon retrait
          </button>
          {!ready && <Link to="/missions" className="btn btn-text btn-block">Faire une mission</Link>}
        </section>
      </div>

      <section className="card">
        <h2>Historique</h2>
        <ul className="history">
          {user.history.map((h, i) => (
            <li key={h.id + i}>
              {h.thumb ? <img src={h.thumb} alt="" className="hthumb" /> : <span className="hico"><Check size={16} strokeWidth={3} /></span>}
              <span className="hbody"><b>{h.title}</b><small>{new Date(h.at).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</small></span>
              <b className="hamount">+{fmt(h.amount)}</b>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
