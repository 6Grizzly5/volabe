import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Smartphone, Coins } from 'lucide-react'
import { Banknote } from '../components/Common.jsx'

export default function Landing() {
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="pill">Ny vola no tanjona</p>
          <h1>Gagne de l’argent facile, une mission à la fois.</h1>
          <p className="lead">Une appli dédiée aux jeunes Malagasy qui veulent gagner de l’argent facile.</p>
          <div className="hero-cta">
            <Link to="/inscription" className="btn btn-gold big">Créer mon compte <ArrowRight size={18} /></Link>
            <Link to="/connexion" className="btn btn-ghost big">J’ai déjà un compte</Link>
          </div>
          <p className="fine"><Coins size={15} /> 5 000 Ar offerts dès l’inscription. Retrait possible à partir de 20 000 Ar.</p>
        </div>
        <div className="hero-note"><Banknote amount="5 000 Ar" /></div>
      </section>

      <section className="steps-sec">
        <h2>Comment ça marche</h2>
        <ol className="how">
          <li><b>Inscris-toi</b><span>Nom, pseudo, email et mot de passe. Ça prend une minute.</span></li>
          <li><b>Choisis une mission</b><span>Six catégories : transport, cerveau, patience, photo, réflexes, vie quotidienne.</span></li>
          <li><b>Encaisse</b><span>Chaque mission validée rapporte entre 2 000 et 6 000 Ar.</span></li>
        </ol>
      </section>

      <section className="trust">
        <div><ShieldCheck size={20} /><p><b>Compte sécurisé</b>Ton mot de passe est protégé sur ton appareil.</p></div>
        <div><Smartphone size={20} /><p><b>Pensé pour ton téléphone</b>Tout se fait du pouce, sans rien installer.</p></div>
      </section>
      <footer className="foot">VolaBe · Ny vola no tanjona</footer>
    </>
  )
}
