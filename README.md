# Calculatrice de prêt

Calculatrice de prêt immobilier / personnel entièrement côté navigateur. Saisissez vos paramètres et obtenez instantanément la mensualité, le coût total, les intérêts et le tableau d'amortissement complet, accompagnés d'un graphique SVG interactif.

---

## Fonctionnalités

- **Saisie intuitive** : montant emprunté, taux annuel (%), durée en années ou en mois
- **Calculs en temps réel** :
  - Mensualité (formule d'amortissement à taux fixe : M = P·r·(1+r)^n / ((1+r)^n − 1))
  - Coût total du crédit
  - Intérêts totaux (avec pourcentage du coût)
  - Gestion du taux 0 % (remboursement linéaire)
- **Cartes résumé** : mensualité, coût total, intérêts totaux
- **Graphique SVG inline** (sans librairie externe) :
  - Donut : répartition Capital vs Intérêts
  - Courbe : évolution du capital restant dû mois par mois
- **Tableau d'amortissement** : numéro de mois, mensualité, part capital, part intérêts, capital restant dû — paginé par 24 lignes, rétractable
- **Formatage euro** via `Intl.NumberFormat` (locale `fr-FR`)
- Interface 100 % française, responsive (mobile → desktop), accessible (ARIA)

---

## Démarrage rapide

```bash
npm install
npm run dev
```

Ouvre ensuite [http://localhost:5173](http://localhost:5173).

---

## Scripts disponibles

| Commande | Description |
|---|---|
| `npm run dev` | Lance le serveur de développement Vite |
| `npm run build` | Compile TypeScript puis génère le bundle de production dans `dist/` |
| `npm run preview` | Prévisualise le build de production localement |
| `npm run deploy` | Build + déploiement sur Cloudflare Pages |

---

## Déploiement sur Cloudflare Pages

```bash
npm run deploy
```

Le script exécute `npm run build` puis `npx wrangler pages deploy dist --project-name loan-calculator`.

Pré-requis : avoir un compte Cloudflare et être authentifié via `npx wrangler login`.

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | React 18 |
| Langage | TypeScript strict |
| Build | Vite 5 |
| Style | Tailwind CSS v3 (police Inter) |
| Graphiques | SVG inline (donut + courbe) |
| Déploiement | Cloudflare Pages (Wrangler) |
| Persistance | Aucune (recalcul direct, pas de localStorage) |

---

## Structure des fichiers créés

```
src/
├── App.tsx                        # Composant racine, état global
├── loanUtils.ts                   # Formules de calcul + formatage euro
└── components/
    ├── LoanForm.tsx               # Formulaire de saisie
    ├── SummaryCards.tsx           # Cartes résumé (mensualité, total, intérêts)
    ├── LoanChart.tsx              # Graphique SVG donut / courbe capital restant
    └── AmortizationTable.tsx      # Tableau d'amortissement paginé
```

---

## Licence

MIT — voir fichier `LICENSE`.
