import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../store.jsx'
import { AvatarPicker } from '../components/Common.jsx'

function Field({ label, error, children }) {
  return (
    <label className={'field' + (error ? ' bad' : '')}>
      <span>{label}</span>
      {children}
      {error && <em className="err">{error}</em>}
    </label>
  )
}

function PasswordInput({ value, onChange, autoComplete, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <div className="pw">
      <input type={show ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} placeholder={placeholder} />
      <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

export function Register() {
  const { register } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ name: '', pseudo: '', email: '', password: '', avatar: null })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    const er = {}
    if (f.name.trim().length < 2) er.name = 'Entre ton nom complet.'
    if (!/^[\p{L}\p{N}_.-]{3,20}$/u.test(f.pseudo.trim())) er.pseudo = '3 à 20 caractères : lettres, chiffres, _ . -'
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = 'Cet email ne semble pas valide.'
    if (f.password.length < 6) er.password = '6 caractères minimum.'
    setErrors(er)
    if (Object.keys(er).length) return
    setBusy(true)
    const res = await register(f)
    setBusy(false)
    if (!res.ok) setErrors({ [res.field || 'form']: res.error })
    else nav('/missions', { replace: true })
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Créer ton compte</h1>
        <p className="sub">Reçois 5 000 Ar dès l’inscription.</p>
        <form onSubmit={submit} noValidate>
          <AvatarPicker value={f.avatar} onChange={(a) => setF((s) => ({ ...s, avatar: a }))} />
          <Field label="Nom complet" error={errors.name}><input value={f.name} onChange={set('name')} autoComplete="name" placeholder="Rakoto Jean" /></Field>
          <Field label="Pseudo" error={errors.pseudo}><input value={f.pseudo} onChange={set('pseudo')} autoComplete="username" placeholder="rakoto_fortune" autoCapitalize="none" /></Field>
          <Field label="Email" error={errors.email}><input type="email" value={f.email} onChange={set('email')} autoComplete="email" placeholder="toi@exemple.com" autoCapitalize="none" /></Field>
          <Field label="Mot de passe" error={errors.password}>
            <PasswordInput value={f.password} onChange={set('password')} autoComplete="new-password" placeholder="6 caractères minimum" />
          </Field>
          <p className="tip">Astuce : choisis un mot de passe que tu n’utilises nulle part ailleurs.</p>
          {errors.form && <p className="err box">{errors.form}</p>}
          <button className="btn btn-gold btn-block big" disabled={busy}>{busy ? 'Création…' : 'Créer mon compte'}</button>
        </form>
        <p className="switch">Déjà inscrit ? <Link to="/connexion">Se connecter</Link></p>
      </div>
    </div>
  )
}

export function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [f, setF] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    if (!f.email.trim() || !f.password) return setError('Entre ton email et ton mot de passe.')
    setBusy(true)
    const res = await login(f)
    setBusy(false)
    if (!res.ok) setError(res.error)
    else nav('/missions', { replace: true })
  }

  return (
    <div className="auth">
      <div className="auth-card">
        <h1>Content de te revoir</h1>
        <p className="sub">Connecte-toi pour reprendre tes missions.</p>
        <form onSubmit={submit} noValidate>
          <Field label="Email"><input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} autoComplete="email" placeholder="toi@exemple.com" autoCapitalize="none" /></Field>
          <Field label="Mot de passe"><PasswordInput value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="current-password" placeholder="Ton mot de passe" /></Field>
          {error && <p className="err box">{error}</p>}
          <button className="btn btn-gold btn-block big" disabled={busy}>{busy ? 'Connexion…' : 'Se connecter'}</button>
        </form>
        <p className="switch">Pas encore de compte ? <Link to="/inscription">S’inscrire</Link></p>
      </div>
    </div>
  )
}
