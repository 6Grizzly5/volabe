import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Camera, Check, ImagePlus, RotateCcw, Share2 } from 'lucide-react'
import { processImage } from '../store.jsx'
import { sec } from '../missions.js'

const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

/* Chaque défi appelle onDone(thumb?) quand il est réussi */

function Steps({ m, onDone }) {
  const [checked, setChecked] = useState(() => m.steps.map(() => false))
  const all = checked.every(Boolean)
  return (
    <div className="ch">
      <ul className="checklist">
        {m.steps.map((s, i) => (
          <li key={i}>
            <label className={checked[i] ? 'on' : ''}>
              <input type="checkbox" checked={checked[i]} onChange={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))} />
              <span className="box">{checked[i] && <Check size={14} strokeWidth={3} />}</span>
              {s}
            </label>
          </li>
        ))}
      </ul>
      <button className="btn btn-gold btn-block" disabled={!all} onClick={() => onDone()}>Déclarer la mission terminée</button>
    </div>
  )
}

function Counter({ m, onDone }) {
  const [n, setN] = useState(0)
  return (
    <div className="ch center">
      <div className="bignum">{n}<small>/{m.target} {m.unit}</small></div>
      <button className="btn btn-gold btn-block big" onClick={() => setN((v) => Math.min(m.target, v + 1))} disabled={n >= m.target}>J’en ai vu un de plus</button>
      <div className="row-gap">
        <button className="btn btn-ghost" onClick={() => setN(0)}><RotateCcw size={15} /> Recommencer</button>
        <button className="btn btn-gold" disabled={n < m.target} onClick={() => onDone()}>Valider</button>
      </div>
    </div>
  )
}

function Hold({ m, onDone }) {
  const total = sec(m.seconds)
  const [p, setP] = useState(0)
  const raf = useRef(0)
  const start = useRef(0)
  const done = useRef(false)
  const stop = () => { cancelAnimationFrame(raf.current); if (!done.current) setP(0) }
  const begin = (e) => {
    e.preventDefault()
    if (done.current) return
    start.current = performance.now()
    const tick = () => {
      const ratio = Math.min(1, (performance.now() - start.current) / (total * 1000))
      setP(ratio)
      if (ratio >= 1) { done.current = true; onDone(); return }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }
  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  return (
    <div className="ch center">
      <button className="holdbtn" style={{ '--p': p }} onPointerDown={begin} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop} onContextMenu={(e) => e.preventDefault()}>
        <span>{p > 0 ? `${Math.ceil(total * (1 - p))} s` : m.label}</span>
      </button>
      <p className="hint">Relâche trop tôt et tout recommence.</p>
    </div>
  )
}

function Text({ m, onDone }) {
  const [v, setV] = useState('')
  const ok = v.trim().length >= m.min
  return (
    <div className="ch">
      <textarea rows={4} value={v} onChange={(e) => setV(e.target.value)} placeholder={m.placeholder} />
      <div className="count"><span className={ok ? 'ok' : ''}>{v.trim().length}/{m.min}</span></div>
      <button className="btn btn-gold btn-block" disabled={!ok} onClick={() => onDone()}>Envoyer au comité</button>
    </div>
  )
}

function Answer({ m, onDone }) {
  const [v, setV] = useState('')
  const [left, setLeft] = useState(m.limit ? sec(m.limit) : null)
  const [result, setResult] = useState(null)
  useEffect(() => {
    if (left === null || result) return
    if (left <= 0) { setResult('late'); return }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left, result])
  const submit = () => {
    const clean = v.trim().toLowerCase()
    setResult(m.expected.some((e) => clean.includes(e)) ? 'ok' : 'ko')
  }
  if (result) {
    return (
      <div className="ch center">
        <p className="verdict">{result === 'ok' ? m.ok : result === 'late' ? 'Temps écoulé. Le comité accepte quand même ton effort.' : m.ko}</p>
        <button className="btn btn-gold btn-block" onClick={() => onDone()}>Récupérer ma récompense</button>
      </div>
    )
  }
  return (
    <div className="ch">
      <div className="question">{m.question}</div>
      {left !== null && <div className={'chrono' + (left <= 5 ? ' hot' : '')}>{left} s</div>}
      <input type="text" value={v} onChange={(e) => setV(e.target.value)} placeholder="Ta réponse" onKeyDown={(e) => e.key === 'Enter' && v.trim() && submit()} />
      <button className="btn btn-gold btn-block" disabled={!v.trim()} onClick={submit}>Répondre</button>
    </div>
  )
}

function Quiz({ m, onDone }) {
  const [i, setI] = useState(0)
  const q = m.questions[i]
  const pick = () => { if (i + 1 >= m.questions.length) onDone(); else setI(i + 1) }
  return (
    <div className="ch">
      <div className="quiz-top"><span>Question {i + 1} sur {m.questions.length}</span><div className="bar"><i style={{ width: `${(i / m.questions.length) * 100}%` }} /></div></div>
      <div className="question">{q.q}</div>
      <div className="options">{q.a.map((a) => <button key={a} className="opt" onClick={pick}>{a}</button>)}</div>
    </div>
  )
}

function Timer({ m, onDone }) {
  const total = sec(m.seconds)
  const [left, setLeft] = useState(null)
  useEffect(() => {
    if (left === null) return
    if (left <= 0) { onDone(); return }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [left])
  return (
    <div className="ch center">
      {left === null ? (
        <button className="btn btn-gold btn-block big" onClick={() => setLeft(total)}>Commencer l’attente</button>
      ) : (
        <>
          <div className="hourglass" aria-hidden>⏳</div>
          <p className="verdict">Le chrono est caché. Respire.</p>
          <div className="bar wide"><i style={{ width: `${((total - left) / total) * 100}%` }} /></div>
          <p className="hint">Reste sur cette page jusqu’à la fin.</p>
        </>
      )}
    </div>
  )
}

function Still({ m, onDone }) {
  const total = sec(m.seconds)
  const [running, setRunning] = useState(false)
  const [t, setT] = useState(0)
  const [broken, setBroken] = useState(false)
  useEffect(() => {
    if (!running) return
    const reset = () => { setT(0); setBroken(true) }
    const evs = ['pointerdown', 'keydown', 'wheel', 'touchmove', 'scroll']
    const arm = setTimeout(() => evs.forEach((e) => window.addEventListener(e, reset, { passive: true })), 400)
    const tick = setInterval(() => setT((v) => v + 1), 1000)
    return () => { clearTimeout(arm); clearInterval(tick); evs.forEach((e) => window.removeEventListener(e, reset)) }
  }, [running])
  useEffect(() => { if (running && t >= total) onDone() }, [t, running])
  return (
    <div className="ch center">
      {!running ? (
        <button className="btn btn-gold btn-block big" onClick={() => { setRunning(true); setBroken(false) }}>Je suis prêt, ne plus bouger</button>
      ) : (
        <>
          <div className="bignum">{t}<small>/{total} s</small></div>
          <p className={'verdict' + (broken ? ' bad' : '')}>{broken ? 'Tu as bougé. Le compteur est reparti à zéro.' : 'Ne touche à rien.'}</p>
        </>
      )}
    </div>
  )
}

function Tap({ m, onDone }) {
  const [n, setN] = useState(0)
  const [left, setLeft] = useState(sec(m.seconds))
  const [state, setState] = useState('idle')
  useEffect(() => {
    if (state !== 'run') return
    if (left <= 0) { setState('fail'); return }
    const t = setTimeout(() => setLeft((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [state, left])
  const tap = () => {
    if (state === 'idle') setState('run')
    if (state === 'fail') return
    const next = n + 1
    setN(next)
    if (next >= m.target) { setState('win'); onDone() }
  }
  const retry = () => { setN(0); setLeft(sec(m.seconds)); setState('idle') }
  return (
    <div className="ch center">
      <div className="bignum">{n}<small>/{m.target}</small></div>
      <div className={'chrono' + (left <= 3 && state === 'run' ? ' hot' : '')}>{left} s</div>
      {state === 'fail' ? (
        <>
          <p className="verdict bad">Trop lent. Le comité est déçu mais disponible.</p>
          <button className="btn btn-gold btn-block" onClick={retry}>Réessayer</button>
        </>
      ) : (
        <button className="tapbtn" onPointerDown={(e) => { e.preventDefault(); tap() }}>TAPE</button>
      )}
    </div>
  )
}

function Order({ m, onDone }) {
  const cells = useMemo(() => [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5), [])
  const [next, setNext] = useState(1)
  const [bad, setBad] = useState(null)
  const press = (c) => {
    if (c === next) {
      if (c === 9) onDone(); else setNext(c + 1)
    } else {
      setBad(c); setNext(1)
      setTimeout(() => setBad(null), 450)
    }
  }
  return (
    <div className="ch center">
      <p className="verdict">Prochaine case : <b>{next}</b></p>
      <div className="grid9">
        {cells.map((c) => (
          <button key={c} className={'cell' + (c < next ? ' done' : '') + (bad === c ? ' bad' : '')} onClick={() => press(c)}>{c}</button>
        ))}
      </div>
    </div>
  )
}

function Runaway({ m, onDone }) {
  const [caught, setCaught] = useState(0)
  const [pos, setPos] = useState({ x: 50, y: 50 })
  const box = useRef(null)
  const jump = () => setPos({ x: 8 + Math.random() * 74, y: 8 + Math.random() * 74 })
  const press = () => {
    const n = caught + 1
    setCaught(n)
    if (n >= m.target) onDone(); else jump()
  }
  return (
    <div className="ch center">
      <p className="verdict">Attrapé : <b>{caught}/{m.target}</b></p>
      <div className="arena" ref={box}>
        <button className="runner" style={{ left: pos.x + '%', top: pos.y + '%' }} onMouseEnter={() => Math.random() < 0.6 && jump()} onClick={press}>Attrape-moi</button>
      </div>
    </div>
  )
}

function Simon({ m, onDone }) {
  const [seq, setSeq] = useState([])
  const [lit, setLit] = useState(-1)
  const [phase, setPhase] = useState('idle') // idle | show | input | lost
  const [idx, setIdx] = useState(0)
  const round = seq.length
  const timers = useRef([])
  useEffect(() => () => timers.current.forEach(clearTimeout), [])
  const play = (s) => {
    setPhase('show'); setIdx(0)
    s.forEach((p, i) => {
      timers.current.push(setTimeout(() => setLit(p), 650 * (i + 1)))
      timers.current.push(setTimeout(() => setLit(-1), 650 * (i + 1) + 400))
    })
    timers.current.push(setTimeout(() => setPhase('input'), 650 * (s.length + 1)))
  }
  const startRound = (prev) => { const s = [...prev, Math.floor(Math.random() * 4)]; setSeq(s); play(s) }
  const press = (p) => {
    if (phase !== 'input') return
    setLit(p); setTimeout(() => setLit(-1), 180)
    if (p !== seq[idx]) { setPhase('lost'); return }
    if (idx + 1 === seq.length) {
      if (seq.length >= m.rounds) { onDone(); return }
      setPhase('wait'); timers.current.push(setTimeout(() => startRound(seq), 700))
    } else setIdx(idx + 1)
  }
  return (
    <div className="ch center">
      <p className="verdict">{phase === 'idle' ? 'Prêt ?' : phase === 'show' ? 'Observe…' : phase === 'input' ? 'À toi !' : phase === 'lost' ? 'Raté. Le comité a ri.' : 'Bien joué…'} {round > 0 && <b> Manche {round}/{m.rounds}</b>}</p>
      <div className="simon">
        {[0, 1, 2, 3].map((p) => <button key={p} className={`pad pad${p}` + (lit === p ? ' lit' : '')} onClick={() => press(p)} aria-label={`Pad ${p + 1}`} />)}
      </div>
      {phase === 'idle' && <button className="btn btn-gold btn-block" onClick={() => startRound([])}>Commencer</button>}
      {phase === 'lost' && <button className="btn btn-gold btn-block" onClick={() => { setSeq([]); setPhase('idle') }}>Recommencer</button>}
    </div>
  )
}

function Sign({ m, onDone }) {
  const cv = useRef(null)
  const drawing = useRef(false)
  const [ink, setInk] = useState(0)
  useEffect(() => {
    const c = cv.current
    const dpr = window.devicePixelRatio || 1
    c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr
    const ctx = c.getContext('2d')
    ctx.scale(dpr, dpr); ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = '#2a2207'
  }, [])
  const pt = (e) => { const r = cv.current.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] }
  const down = (e) => { drawing.current = true; cv.current.setPointerCapture(e.pointerId); const [x, y] = pt(e); const ctx = cv.current.getContext('2d'); ctx.beginPath(); ctx.moveTo(x, y) }
  const move = (e) => { if (!drawing.current) return; const [x, y] = pt(e); const ctx = cv.current.getContext('2d'); ctx.lineTo(x, y); ctx.stroke(); setInk((v) => v + 1) }
  const up = () => { drawing.current = false }
  const clear = () => { const c = cv.current; c.getContext('2d').clearRect(0, 0, c.width, c.height); setInk(0) }
  const validate = () => {
    const c = cv.current
    const t = document.createElement('canvas'); t.width = 240; t.height = Math.round(240 * c.height / c.width)
    const x = t.getContext('2d'); x.fillStyle = '#fffdf3'; x.fillRect(0, 0, t.width, t.height); x.drawImage(c, 0, 0, t.width, t.height)
    onDone(t.toDataURL('image/jpeg', 0.7))
  }
  return (
    <div className="ch">
      <canvas ref={cv} className="sigpad" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} />
      <div className="row-gap">
        <button className="btn btn-ghost" onClick={clear}><RotateCcw size={15} /> Effacer</button>
        <button className="btn btn-gold" disabled={ink < 25} onClick={validate}>Valider ma signature</button>
      </div>
    </div>
  )
}

function Photo({ m, onDone }) {
  const [img, setImg] = useState(null)
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const cam = useRef(null)
  const gal = useRef(null)
  const onFile = async (e) => {
    const f = e.target.files?.[0]
    e.target.value = ''
    if (!f) return
    setBusy(true); setErr('')
    try { setImg(await processImage(f, { size: 900 })) } catch (er) { setErr(er.message) }
    setBusy(false)
  }
  const finish = async () => {
    const blob = await (await fetch(img)).blob()
    const thumb = await processImage(new File([blob], 'p.jpg', { type: 'image/jpeg' }), { size: 160, quality: 0.6 })
    onDone(thumb)
  }
  return (
    <div className="ch center">
      {!img ? (
        <>
          <div className="photo-empty"><Camera size={34} /><span>{busy ? 'Traitement…' : 'Aucune photo pour l’instant'}</span></div>
          <div className="row-gap">
            <button className="btn btn-gold" onClick={() => cam.current.click()}><Camera size={16} /> Prendre une photo</button>
            <button className="btn btn-ghost" onClick={() => gal.current.click()}><ImagePlus size={16} /> Galerie</button>
          </div>
        </>
      ) : (
        <>
          <div className="photo-frame">
            <img src={img} alt="Ta photo" />
            <span className="stamp">{m.stamp}</span>
          </div>
          <div className="row-gap">
            <button className="btn btn-ghost" onClick={() => setImg(null)}><RotateCcw size={15} /> Refaire</button>
            <button className="btn btn-gold" onClick={finish}>Soumettre au comité</button>
          </div>
        </>
      )}
      {err && <p className="err">{err}</p>}
      <input ref={cam} type="file" accept="image/*" capture={m.capture} hidden onChange={onFile} />
      <input ref={gal} type="file" accept="image/*" hidden onChange={onFile} />
      <p className="hint">La photo est traitée sur ton appareil. Rien n’est envoyé.</p>
    </div>
  )
}

function Share({ m, onDone }) {
  const [msg, setMsg] = useState('')
  const url = window.location.origin
  const text = 'Rejoins VolaBe, l’appli pour gagner de l’argent facile 💛'
  const go = async () => {
    try {
      if (navigator.share) { await navigator.share({ title: 'VolaBe', text, url }); onDone(); return }
      await navigator.clipboard.writeText(`${text} ${url}`)
      setMsg('Lien copié. Colle-le à un ami.')
      setTimeout(onDone, 900)
    } catch {
      setMsg('Partage annulé. Réessaie.')
    }
  }
  return (
    <div className="ch center">
      <div className="linkbox">{url}</div>
      <button className="btn btn-gold btn-block big" onClick={go}><Share2 size={17} /> Partager VolaBe</button>
      {msg && <p className="hint">{msg}</p>}
    </div>
  )
}

const MAP = { steps: Steps, counter: Counter, hold: Hold, text: Text, answer: Answer, quiz: Quiz, timer: Timer, still: Still, tap: Tap, order: Order, runaway: Runaway, simon: Simon, sign: Sign, photo: Photo, share: Share }

export default function Challenge({ mission, onDone }) {
  const C = MAP[mission.kind]
  return <C m={mission} onDone={onDone} />
}
