import {
  Bus, Brain, Timer, Camera, Hand, Calculator, Footprints, Droplets, Mic,
  Eye, Grid3x3, Zap, Ticket, Share2, PenLine, Sun, Lightbulb, Egg, Music, MousePointerClick
} from 'lucide-react'

// Mettre ?turbo dans l'URL divise les durées par 20 (pratique pour tester vite)
export const TURBO = typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('turbo')
export const sec = (n) => (TURBO ? Math.max(3, Math.round(n / 20)) : n)

export const CATEGORIES = [
  { id: 'transport', label: 'Transport', blurb: 'Bouger pour mériter.' },
  { id: 'cerveau', label: 'Cerveau', blurb: 'Réfléchir (un peu).' },
  { id: 'patience', label: 'Patience', blurb: 'Ne rien faire, mais sérieusement.' },
  { id: 'photo', label: 'Photo', blurb: 'Prouver sans rien envoyer.' },
  { id: 'reflexes', label: 'Réflexes', blurb: 'Doigts rapides, esprit calme.' },
  { id: 'quotidien', label: 'Vie quotidienne', blurb: 'Des gestes simples, un comité exigeant.' },
]

export const MISSIONS = [
  // Transport
  { id: 'bus', cat: 'transport', icon: Bus, title: 'Le marathon des bus', reward: 6000, level: 'Épique', time: '1 journée',
    text: 'Prends trois bus différents dans la même journée, puis reviens déclarer ta mission. Facultatif si tu n’as pas de monnaie : le comité comprend.',
    kind: 'steps', steps: ['J’ai pris le premier bus', 'J’ai pris un deuxième bus, différent', 'J’ai pris un troisième bus, encore différent', 'Je jure que je n’ai pas triché'] },
  { id: 'taxibe', cat: 'transport', icon: Ticket, title: 'Le recensement des taxi-be', reward: 4000, level: 'Difficile', time: '10 min',
    text: 'Compte dix taxi-be jaunes. Appuie sur le bouton à chaque taxi-be repéré, sans te faire écraser.', kind: 'counter', target: 10, unit: 'taxi-be' },
  { id: 'marche', cat: 'transport', icon: Footprints, title: 'La marche sans destination', reward: 3000, level: 'Moyen', time: '3 min',
    text: 'Marche trois minutes sans savoir où tu vas. Maintiens le bouton enfoncé pour prouver ta détermination.', kind: 'hold', seconds: 10, label: 'Maintiens pour marcher' },

  // Cerveau
  { id: 'reflexion', cat: 'cerveau', icon: Brain, title: 'La réflexion nationale', reward: 3000, level: 'Philosophique', time: '2 min',
    text: 'Si tu achètes un portefeuille vide, as-tu perdu de l’argent ou investi dans son avenir ? Rédige une réponse convaincante (25 caractères minimum).',
    kind: 'text', min: 25, placeholder: 'Selon moi, un portefeuille vide est…' },
  { id: 'calcul', cat: 'cerveau', icon: Calculator, title: 'Le calcul interdit', reward: 2000, level: 'Extrême', time: '15 sec',
    text: 'Calcule 7 + 8 de tête, sans calculatrice. Tu as 15 secondes. Le comité scientifique observe.', kind: 'answer', question: '7 + 8 = ?', expected: ['15'], limit: 15,
    ok: 'Exact. Le comité est stupéfait.', ko: 'Faux, mais le comité a décidé d’être généreux aujourd’hui.' },
  { id: 'coq', cat: 'cerveau', icon: Egg, title: 'L’énigme du coq', reward: 3000, level: 'Mystérieuse', time: '2 min',
    text: 'Un coq pond un œuf sur un toit pointu. De quel côté tombe l’œuf ? Réponds avec assurance.', kind: 'answer', question: 'Côté gauche, côté droit… ou autre ?', expected: ['aucun', 'jamais', 'les coqs ne pondent pas', 'coq ne pond pas', 'ne pond pas'],
    ok: 'Brillant. Un coq ne pond pas : tu as compris la vraie nature du piège.', ko: 'Un coq ne pond pas d’œuf. Mais ta confiance a été notée.' },
  { id: 'quiz', cat: 'cerveau', icon: Lightbulb, title: 'Le quiz éclair du comité', reward: 4000, level: 'Variable', time: '3 min',
    text: 'Cinq questions officielles. Toutes les réponses sont acceptées, mais certaines sont plus respectables que d’autres.', kind: 'quiz',
    questions: [
      { q: 'Combien de mois ont 28 jours ?', a: ['Un seul', 'Les douze', 'Aucun'] },
      { q: 'Que mange un vrai riche au petit-déjeuner ?', a: ['Du mofo gasy', 'Des promesses', 'Du riz d’hier'] },
      { q: 'Combien d’ariary dans un million d’ariary ?', a: ['Un million', 'Beaucoup', 'Pas assez'] },
      { q: 'Qui paie les frais de retrait ?', a: ['Le comité', 'Personne', 'Toi, probablement'] },
      { q: 'Quelle est la couleur du cheval blanc de Jean ?', a: ['Blanche', 'Jaune doré', 'Dépend du budget'] },
    ] },

  // Patience
  { id: 'attente', cat: 'patience', icon: Timer, title: 'L’investissement temporel', reward: 4000, level: 'Pénible', time: '5 min',
    text: 'Attends cinq minutes sans regarder l’heure. Le chrono ci-dessous est caché pour ne pas te tenter.', kind: 'timer', seconds: 300 },
  { id: 'immobile', cat: 'patience', icon: Eye, title: 'L’épreuve du doigt immobile', reward: 3500, level: 'Zen', time: '20 sec',
    text: 'Ne touche plus l’écran pendant vingt secondes. Pas un clic, pas un scroll, pas une touche. Le moindre geste remet le compteur à zéro.', kind: 'still', seconds: 20 },

  // Photo
  { id: 'selfie', cat: 'photo', icon: Camera, title: 'Le selfie du sérieux', reward: 3000, level: 'Facile', time: '1 min',
    text: 'Prends un selfie avec ton visage le plus sérieux possible. La photo reste sur ton téléphone, elle n’est envoyée nulle part.', kind: 'photo', capture: 'user', stamp: 'Sérieux certifié' },
  { id: 'jaune', cat: 'photo', icon: Sun, title: 'Le chasseur d’objets jaunes', reward: 3000, level: 'Moyen', time: '5 min',
    text: 'Photographie un objet jaune. Plus il est jaune, plus le comité est ému.', kind: 'photo', capture: 'environment', stamp: 'Jaune validé' },
  { id: 'busphoto', cat: 'photo', icon: Bus, title: 'Une preuve de bus', reward: 4000, level: 'Difficile', time: '15 min',
    text: 'Photographie un bus (de loin, par pitié). Le comité vérifie la présence d’un bus à l’image.', kind: 'photo', capture: 'environment', stamp: 'Bus authentifié' },

  // Réflexes
  { id: 'taps', cat: 'reflexes', icon: Hand, title: 'Trente tapes en dix secondes', reward: 3500, level: 'Sportif', time: '10 sec',
    text: 'Appuie trente fois sur le bouton doré avant la fin du chrono. Tes pouces sont attendus.', kind: 'tap', target: 30, seconds: 10 },
  { id: 'parcours', cat: 'reflexes', icon: Grid3x3, title: 'Le parcours de clics', reward: 4500, level: 'Cruel', time: '1 min',
    text: 'Touche les cases de 1 à 9 dans l’ordre. Une mauvaise case et tu recommences au début.', kind: 'order' },
  { id: 'fuyard', cat: 'reflexes', icon: MousePointerClick, title: 'Le bouton qui fuit', reward: 4000, level: 'Frustrant', time: '2 min',
    text: 'Attrape le bouton trois fois. Il n’aime pas qu’on le touche.', kind: 'runaway', target: 3 },
  { id: 'simon', cat: 'reflexes', icon: Zap, title: 'La mémoire d’éléphant', reward: 5000, level: 'Épuisant', time: '2 min',
    text: 'Retiens la séquence de lumières et reproduis-la. Quatre manches, une seule erreur autorisée par manche.', kind: 'simon', rounds: 4 },

  // Vie quotidienne
  { id: 'eau', cat: 'quotidien', icon: Droplets, title: 'L’hydratation officielle', reward: 2000, level: 'Facile', time: '30 sec',
    text: 'Bois un verre d’eau puis maintiens le bouton pour confirmer que tu as été courageux.', kind: 'hold', seconds: 3, label: 'Maintiens pour confirmer' },
  { id: 'discours', cat: 'quotidien', icon: Mic, title: 'Le discours du futur riche', reward: 2500, level: 'Gênant', time: '1 min',
    text: 'Dis à voix haute : « Je suis riche. » Trois fois. Coche chaque fois.', kind: 'steps', steps: ['Première fois', 'Deuxième fois, avec conviction', 'Troisième fois, comme si tu le croyais'] },
  { id: 'signature', cat: 'quotidien', icon: PenLine, title: 'La signature de millionnaire', reward: 3000, level: 'Artistique', time: '1 min',
    text: 'Dessine ta future signature de millionnaire avec ton doigt. Plus elle est grosse, plus c’est crédible.', kind: 'sign' },
  { id: 'danse', cat: 'quotidien', icon: Music, title: 'La danse de la victoire', reward: 3000, level: 'Honteux', time: '15 sec',
    text: 'Danse pendant dix secondes. Maintiens le bouton pour que le comité sache que tu danses encore.', kind: 'hold', seconds: 10, label: 'Maintiens et danse' },

  // Bonus Social (rangé dans la catégorie quotidien)
  { id: 'parrain', cat: 'quotidien', icon: Share2, title: 'Le parrainage solidaire', reward: 5000, level: 'Social', time: '1 min',
    text: 'Partage VolaBe avec un ami (ou fais semblant). Le bouton copie le lien ou ouvre le partage de ton téléphone.', kind: 'share' },
]

export const missionById = (id) => MISSIONS.find((m) => m.id === id)
export const totalPossible = MISSIONS.reduce((s, m) => s + m.reward, 0)
