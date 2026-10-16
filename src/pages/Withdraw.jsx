import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { FINAL_THRESHOLD, FIRST_THRESHOLD, fmt, useAuth } from '../store.jsx'

const OPERATORS = ['MVola', 'Orange Money', 'Airtel Money']

export default function Withdraw() {
  const { user, updateUser } = useAuth()
  const nav = useNavigate()
  const [step, setStep] = useState('form') // form | check | error
  const [f, setF] = useState({ op: OPERATORS[0], phone: '', age: '', city: '' })
  const [errors, setErrors] = useState({})
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    if (step !== 'check') return
    const timers = [1200, 2600, 4000].map((ms, i) => setTimeout(() => setPhase(i + 1), ms))
    const end = setTimeout(() => setStep('error'), 5200)
    return () => { timers.forEach(clearTimeout); clearTimeout(end) }
  }, [step])

  if (user.stage !== 'start' || user.balance < FIRST_THRESHOLD) return <Navigate to="/portefeuille" replace />

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    const digits = f.phone.replace(/\D/g, '')
    if (digits.length < 9) er.phone = 'Entre un numéro valide (ex. 034 12 345 67).'
    const age = Number(f.age)
    if (!age || age < 10 || age > 99) er.age = 'Entre ton âge.'
    if (f.city.trim().length < 2) er.city = 'Indique ta ville ou ton quartier.'
    setErrors(er)
    if (!Object.keys(er).length) { setPhase(0); setStep('check') }
  }

  const lines = ['Vérification du numéro', 'Contrôle de l’éligibilité', 'Validation par le comité']

  if (step === 'check') {
    return (
      <div className="page narrow">
        <div className="card center">
          <Loader2 className="spin" size={34} />
          <h1 className="h2">Vérification en cours</h1>
          <ul className="checks">
            {lines.map((l, i) => (
              <li key={l} className={phase > i ? 'ok' : phase === i ? 'now' : ''}>
                {phase > i ? <CheckCircle2 size={18} /> : <span className="dot" />} {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  if (step === 'error') {
    return (
      <div className="page narrow">
        <div className="card center">
          <span className="alert-ico"><AlertTriangle size={30} /></span>
          <h1 className="h2">Une erreur s’est glissée dans nos conditions</h1>
          <p className="muted">Le minimum de retrait n’est pas de {fmt(FIRST_THRESHOLD)}. Il est de :</p>
          <div className="win-amount">{fmt(FINAL_THRESHOLD)}</div>
          <p className="muted">Ton solde actuel : <b>{fmt(user.balance)}</b>. Tu y es presque, continue tes missions.</p>
          <button className="btn btn-gold btn-block big" onClick={() => { updateUser({ stage: 'raised' }); nav('/missions') }}>Retour aux missions</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page narrow">
      <div className="card">
        <h1 className="h2">Vérification avant retrait</h1>
        <p className="muted">Ton solde de {fmt(user.balance)} est prêt. Confirme tes informations pour recevoir ton argent.</p>
        <form onSubmit={submit} noValidate className="stack">
          <label className="field"><span>Opérateur mobile</span>
            <select value={f.op} onChange={(e) => setF({ ...f, op: e.target.value })}>{OPERATORS.map((o) => <option key={o}>{o}</option>)}</select>
          </label>
          <label className={'field' + (errors.phone ? ' bad' : '')}><span>Numéro de téléphone</span>
            <input type="tel" inputMode="tel" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} placeholder="034 12 345 67" />
            {errors.phone && <em className="err">{errors.phone}</em>}
          </label>
          <label className={'field' + (errors.age ? ' bad' : '')}><span>Âge</span>
            <input type="number" inputMode="numeric" value={f.age} onChange={(e) => setF({ ...f, age: e.target.value })} placeholder="20" />
            {errors.age && <em className="err">{errors.age}</em>}
          </label>
          <label className={'field' + (errors.city ? ' bad' : '')}><span>Ville ou quartier</span>
            <input value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} placeholder="Antananarivo, Analakely" />
            {errors.city && <em className="err">{errors.city}</em>}
          </label>
          <button className="btn btn-gold btn-block big">Confirmer et retirer</button>
        </form>
      </div>
    </div>
  )
}
