import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'
import { Avatar, AvatarPicker } from '../components/Common.jsx'
import { fmt, useAuth } from '../store.jsx'

export default function Profile() {
  const { user, updateUser, logout, resetProgress, deleteAccount } = useAuth()
  const nav = useNavigate()
  const [edit, setEdit] = useState(false)
  const [confirm, setConfirm] = useState(false)

  return (
    <div className="page narrow">
      <h1 className="ptitle">Profil</h1>
      <section className="card prof">
        <Avatar user={user} size={84} />
        <div>
          <h2>{user.name}</h2>
          <p className="muted">@{user.pseudo}</p>
          <p className="muted">{user.email}</p>
        </div>
      </section>

      <section className="card">
        <h2>Photo de profil</h2>
        {edit ? (
          <>
            <AvatarPicker value={user.avatar} onChange={(a) => updateUser({ avatar: a })} label="Nouvelle photo" />
            <button className="btn btn-gold" onClick={() => setEdit(false)}>Terminé</button>
          </>
        ) : (
          <button className="btn btn-ghost" onClick={() => setEdit(true)}>Changer ma photo</button>
        )}
      </section>

      <section className="card">
        <h2>Mes chiffres</h2>
        <div className="row-between"><span>Solde</span><b>{fmt(user.balance)}</b></div>
        <div className="row-between"><span>Missions terminées</span><b>{Object.keys(user.done).length}</b></div>
      </section>

      <section className="card stack">
        <button className="btn btn-ghost btn-block" onClick={() => { logout(); nav('/') }}><LogOut size={16} /> Se déconnecter</button>
        <button className="btn btn-ghost btn-block" onClick={() => { resetProgress(); nav('/missions') }}>Remettre mon solde à zéro</button>
        {!confirm ? (
          <button className="btn btn-text btn-block danger" onClick={() => setConfirm(true)}>Supprimer mon compte</button>
        ) : (
          <div className="confirm">
            <p>Cette action efface ton compte et toute ta progression sur cet appareil.</p>
            <button className="btn btn-danger btn-block" onClick={() => { deleteAccount(); nav('/') }}>Oui, supprimer</button>
            <button className="btn btn-text btn-block" onClick={() => setConfirm(false)}>Annuler</button>
          </div>
        )}
      </section>
    </div>
  )
}
