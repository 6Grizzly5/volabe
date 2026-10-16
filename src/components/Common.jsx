import React, { useRef, useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { Camera, Home, ListChecks, Wallet, User, ImagePlus } from 'lucide-react'
import { fmt, processImage, useAuth } from '../store.jsx'

export function Logo({ size = 34 }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden>
        <rect width="64" height="64" rx="17" fill="#F2B705" />
        <path d="M16 20l16 28 16-28" fill="none" stroke="#fff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <b>VolaBe</b>
    </span>
  )
}

export function Avatar({ user, size = 40 }) {
  const initials = (user?.pseudo || user?.name || '?').slice(0, 2).toUpperCase()
  return user?.avatar
    ? <img className="avatar" style={{ width: size, height: size }} src={user.avatar} alt={`Photo de ${user.pseudo}`} />
    : <span className="avatar ph" style={{ width: size, height: size, fontSize: size * 0.38 }}>{initials}</span>
}

export function AvatarPicker({ value, onChange, label = 'Photo de profil' }) {
  const cam = useRef(null)
  const gal = useRef(null)
  const [err, setErr] = useState('')
  const onFile = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    try { setErr(''); onChange(await processImage(f, { size: 256, square: true, quality: 0.85 })) } catch (er) { setErr(er.message) }
  }
  return (
    <div className="avatar-picker">
      <div className="ap-preview">
        {value ? <img src={value} alt="Aperçu" /> : <Camera size={26} />}
      </div>
      <div className="ap-actions">
        <span className="lbl">{label} <em>(facultatif)</em></span>
        <div className="row-gap left">
          <button type="button" className="btn btn-ghost sm" onClick={() => cam.current.click()}><Camera size={15} /> Selfie</button>
          <button type="button" className="btn btn-ghost sm" onClick={() => gal.current.click()}><ImagePlus size={15} /> Galerie</button>
          {value && <button type="button" className="btn btn-text sm" onClick={() => onChange(null)}>Retirer</button>}
        </div>
        {err && <span className="err">{err}</span>}
      </div>
      <input ref={cam} type="file" accept="image/*" capture="user" hidden onChange={onFile} />
      <input ref={gal} type="file" accept="image/*" hidden onChange={onFile} />
    </div>
  )
}

export function Header() {
  const { user } = useAuth()
  return (
    <header className="topbar">
      <Link to={user ? '/missions' : '/'} className="brand"><Logo /></Link>
      {user ? (
        <>
          <nav className="dnav" aria-label="Navigation principale">
            <NavLink to="/missions"><ListChecks size={16} /> Missions</NavLink>
            <NavLink to="/portefeuille"><Wallet size={16} /> Portefeuille</NavLink>
            <NavLink to="/profil"><User size={16} /> Profil</NavLink>
          </nav>
          <Link to="/portefeuille" className="balance-chip"><Avatar user={user} size={28} /><b>{fmt(user.balance)}</b></Link>
        </>
      ) : (
        <div className="auth-links">
          <Link to="/connexion" className="btn btn-text sm">Connexion</Link>
          <Link to="/inscription" className="btn btn-gold sm">S’inscrire</Link>
        </div>
      )}
    </header>
  )
}

export function BottomNav() {
  const { user } = useAuth()
  if (!user) return null
  return (
    <nav className="bnav" aria-label="Navigation mobile">
      <NavLink to="/missions"><ListChecks size={21} /><span>Missions</span></NavLink>
      <NavLink to="/portefeuille"><Wallet size={21} /><span>Portefeuille</span></NavLink>
      <NavLink to="/profil"><User size={21} /><span>Profil</span></NavLink>
    </nav>
  )
}

export function Banknote({ amount, name }) {
  return (
    <div className="banknote" aria-hidden={!name}>
      <svg className="guilloche" viewBox="0 0 400 220" preserveAspectRatio="none" aria-hidden>
        {Array.from({ length: 14 }).map((_, i) => (
          <path key={i} d={`M-10 ${20 + i * 14} C 80 ${-10 + i * 14}, 160 ${70 + i * 14}, 240 ${20 + i * 14} S 380 ${60 + i * 14}, 420 ${20 + i * 14}`} fill="none" stroke="currentColor" strokeWidth="0.8" />
        ))}
        <circle cx="330" cy="110" r="52" fill="none" stroke="currentColor" strokeWidth="0.8" />
        <circle cx="330" cy="110" r="38" fill="none" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <div className="bn-top"><span>Banque VolaBe</span><span>Ny vola no tanjona</span></div>
      <div className="bn-amount">{amount}</div>
      <div className="bn-bottom"><span>{name || 'Titulaire : toi, bientôt'}</span><span className="bn-seal">V</span></div>
    </div>
  )
}
