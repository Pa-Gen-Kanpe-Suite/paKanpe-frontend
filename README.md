# Frontend PA GEN KANPE

Application Next.js responsive pour les clients, agents d'accueil, caissiers, administrateurs et l'écran public. Le navigateur ne conserve jamais le JWT : les routes serveur le placent dans un cookie HTTP-only et jouent le rôle de BFF.

## Démarrage

    cp .env.example .env.local
    npm ci
    npm run dev

Ouvrir `http://localhost:3000`. L'API doit être disponible à la valeur de `BACKEND_URL`.

## Vérification

    npm run lint
    npm test
    npm run build
    npx playwright install chromium
    npm run test:e2e

## Parcours disponibles

- Public : accueil, recherche de ticket, affichage des appels.
- Client : inscription, connexion, choix de service, ticket actif, suivi, annulation.
- Agent : création et impression d'un ticket physique.
- Caissier : ouverture/pause du guichet, appel FIFO, démarrage, clôture, absence.
- Administrateur : indicateurs du jour, ouverture/fermeture et création de guichets.

## Déploiement

La CI vérifie ESLint, Vitest, le build de production et Playwright. La CD publie une image OCI sur GitHub Container Registry et peut appeler un webhook de staging si le secret correspondant est présent.

