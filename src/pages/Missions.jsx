import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, ChevronRight } from 'lucide-react'
import { CATEGORIES, MISSIONS } from '../missions.js'
import { FINAL_THRESHOLD, FIRST_THRESHOLD, fmt, useAuth, threshold } from '../store.jsx'

export default function Missions() {
  const { user } = useAuth()
  const [cat, setCat] = useState('all')
  const goal = threshold(user)
  const pct = Math.min(100, (user.balance / goal) * 100)
  const doneCount = Object.keys(user.done).length
  const cats = cat === 'all' ? CATEGORIES : CATEGORIES.filter((c) => c.id === cat)

  return (
    <div className="page">
      <section className="goal">
        <div>
          <span className="lbl">Solde</span>
          <div className="goal-amount">{fmt(user.balance)}</div>
        </div>
        <div className="goal-bar">
          <div className="goal-line"><span>Retrait minimum</span><b>{fmt(goal)}</b></div>
          <div className="bar wide"><i style={{ width: pct + '%' }} /></div>
          <small>{user.balance >= goal ? 'Objectif atteint : tu peux demander ton retrait.' : `Encore ${fmt(goal - user.balance)} avant le retrait.`}</small>
        </div>
      </section>

      <div className="chips" role="tablist" aria-label="Catégories">
        <button className={cat === 'all' ? 'on' : ''} onClick={() => setCat('all')}>Toutes <i>{doneCount}/{MISSIONS.length}</i></button>
        {CATEGORIES.map((c) => (
          <button key={c.id} className={cat === c.id ? 'on' : ''} onClick={() => setCat(c.id)}>{c.label}</button>
        ))}
      </div>

      {cats.map((c) => {
        const list = MISSIONS.filter((m) => m.cat === c.id)
        const done = list.filter((m) => user.done[m.id]).length
        return (
          <section key={c.id} className="cat">
            <header>
              <h2>{c.label}</h2>
              <span>{c.blurb} · {done}/{list.length}</span>
            </header>
            <div className="mlist">
              {list.map((m) => {
                const isDone = !!user.done[m.id]
                const Icon = m.icon
                return (
                  <Link key={m.id} to={`/missions/${m.id}`} className={'mcard' + (isDone ? ' done' : '')}>
                    <span className="mico">{isDone ? <Check size={20} strokeWidth={3} /> : <Icon size={20} />}</span>
                    <span className="mbody">
                      <b>{m.title}</b>
                      <small>{m.level} · {m.time}</small>
                    </span>
                    <span className="mreward">{isDone ? 'Terminée' : '+' + fmt(m.reward)}</span>
                    <ChevronRight size={18} className="chev" />
                  </Link>
                )
              })}
            </div>
          </section>
        )
      })}
    </div>
  )
}
