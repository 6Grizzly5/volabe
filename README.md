# VolaBe — V0.2

Prank React (Vite) : une fausse appli de gains pour les jeunes Malagasy.
Jaune doré et blanc, pensée d'abord pour les smartphones.

## Lancer en local
```bash
npm install
npm run dev
```
Ouvre l'adresse affichée par Vite (sur ton téléphone : même Wi-Fi, adresse « Network »).

Astuce test : ajoute `?turbo` à l'adresse (ex. `http://localhost:5173/?turbo`)
pour diviser les durées par 20 (attente de 5 min → 15 s).

## Déployer sur Vercel
1. Mets le dossier sur GitHub.
2. Vercel > Add New > Project > importe le dépôt.
3. Preset Vite détecté automatiquement (build `npm run build`, sortie `dist`).
`vercel.json` redirige toutes les routes vers `index.html`.

## Scénario
- Inscription (nom, pseudo, email, mot de passe, photo facultative) : 5 000 Ar offerts.
- 21 missions rangées en 6 catégories, de 2 000 à 6 000 Ar chacune.
- Retrait annoncé à 20 000 Ar. Une fois atteint : formulaire « vérification »,
  puis « erreur », le minimum passe à 70 000 Ar.
- À 70 000 Ar, le bouton de retrait déclenche la révélation du prank.

## Données
Tout reste dans le navigateur de chaque personne (`localStorage`) : comptes,
solde, photos. Il n'y a ni serveur ni base de données, donc :
- tu ne vois pas les inscriptions de tes amis ;
- un compte créé sur un téléphone n'existe pas sur un autre.
Les mots de passe sont hachés (SHA-256 + sel) avant d'être enregistrés.
Le numéro, l'âge et la ville du formulaire de retrait ne sont jamais enregistrés ni envoyés.
Les photos sont réduites et gardées sur l'appareil.
