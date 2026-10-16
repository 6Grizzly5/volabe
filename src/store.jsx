import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export const START_BALANCE = 5000
export const FIRST_THRESHOLD = 20000
export const FINAL_THRESHOLD = 70000

const USERS_KEY = 'volabe_users_v2'
const SESSION_KEY = 'volabe_session_v2'

export const fmt = (n) => new Intl.NumberFormat('fr-FR').format(Math.round(n)).replace(/\u202f|\u00a0/g, ' ') + ' Ar'

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY)) || [] } catch { return [] }
}
function writeUsers(users) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); return true } catch { return false }
}

async function hashPassword(password, salt) {
  const text = `${salt}:${password}`
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
    return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
  } catch {
    let h = 5381
    for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0
    return 'f' + h
  }
}

const AuthCtx = createContext(null)
export const useAuth = () => useContext(AuthCtx)

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(readUsers)
  const [sessionId, setSessionId] = useState(() => {
    try { return localStorage.getItem(SESSION_KEY) } catch { return null }
  })

  const user = useMemo(() => users.find((u) => u.id === sessionId) || null, [users, sessionId])

  useEffect(() => { writeUsers(users) }, [users])
  useEffect(() => {
    try {
      if (sessionId) localStorage.setItem(SESSION_KEY, sessionId)
      else localStorage.removeItem(SESSION_KEY)
    } catch { /* stockage indisponible */ }
  }, [sessionId])

  const register = useCallback(async ({ name, pseudo, email, password, avatar }) => {
    const current = readUsers()
    const mail = email.trim().toLowerCase()
    if (current.some((u) => u.email === mail)) return { ok: false, field: 'email', error: 'Cet email est déjà inscrit. Connecte-toi plutôt.' }
    if (current.some((u) => u.pseudo.toLowerCase() === pseudo.trim().toLowerCase())) return { ok: false, field: 'pseudo', error: 'Ce pseudo est déjà pris. Essaie-en un autre.' }
    const salt = Math.random().toString(36).slice(2) + Date.now().toString(36)
    const newUser = {
      id: 'u_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name.trim(), pseudo: pseudo.trim(), email: mail,
      salt, hash: await hashPassword(password, salt),
      avatar: avatar || null,
      createdAt: Date.now(),
      balance: START_BALANCE,
      stage: 'start',
      done: {},
      history: [{ id: 'bonus', title: 'Bonus de bienvenue', amount: START_BALANCE, at: Date.now() }],
    }
    const next = [...current, newUser]
    if (!writeUsers(next)) return { ok: false, field: null, error: "Ton navigateur bloque l'enregistrement (mode privé ?). Ouvre VolaBe dans un onglet normal." }
    setUsers(next)
    setSessionId(newUser.id)
    return { ok: true }
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const found = readUsers().find((u) => u.email === email.trim().toLowerCase())
    if (!found) return { ok: false, error: 'Aucun compte avec cet email.' }
    const h = await hashPassword(password, found.salt)
    if (h !== found.hash) return { ok: false, error: 'Mot de passe incorrect.' }
    setUsers(readUsers())
    setSessionId(found.id)
    return { ok: true }
  }, [])

  const logout = useCallback(() => setSessionId(null), [])

  const updateUser = useCallback((patch) => {
    setUsers((list) => list.map((u) => (u.id === sessionId ? { ...u, ...(typeof patch === 'function' ? patch(u) : patch) } : u)))
  }, [sessionId])

  const completeMission = useCallback((mission, thumb) => {
    updateUser((u) => {
      if (u.done[mission.id]) return {}
      return {
        balance: u.balance + mission.reward,
        done: { ...u.done, [mission.id]: Date.now() },
        history: [{ id: mission.id, title: mission.title, amount: mission.reward, at: Date.now(), thumb: thumb || null }, ...u.history],
      }
    })
  }, [updateUser])

  const resetProgress = useCallback(() => {
    updateUser({
      balance: START_BALANCE, stage: 'start', done: {},
      history: [{ id: 'bonus', title: 'Bonus de bienvenue', amount: START_BALANCE, at: Date.now() }],
    })
  }, [updateUser])

  const deleteAccount = useCallback(() => {
    const rest = readUsers().filter((u) => u.id !== sessionId)
    writeUsers(rest)
    setUsers(rest)
    setSessionId(null)
  }, [sessionId])

  const value = { user, register, login, logout, updateUser, completeMission, resetProgress, deleteAccount }
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export const threshold = (user) => (user?.stage === 'start' ? FIRST_THRESHOLD : FINAL_THRESHOLD)

/* Réduit une photo choisie/prise avec l'appareil, localement dans le navigateur */
export function processImage(file, { size = 640, square = false, quality = 0.82 } = {}) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error("Ce fichier n'est pas une image."))
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      let sx = 0, sy = 0, sw = img.width, sh = img.height
      if (square) {
        const m = Math.min(sw, sh)
        sx = (sw - m) / 2; sy = (sh - m) / 2; sw = m; sh = m
      }
      const scale = Math.min(1, size / Math.max(sw, sh))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(sw * scale); canvas.height = Math.round(sh * scale)
      canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
      URL.revokeObjectURL(url)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Impossible de lire cette photo. Essaie un autre format (JPG ou PNG).")) }
    img.src = url
  })
}
