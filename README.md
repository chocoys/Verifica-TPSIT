# E-Commerce TPSIT - Progetto Compito

## Architettura
Il progetto segue un'architettura **Thick Client**. Il frontend (Vanilla JS) gestisce la logica di presentazione e le chiamate asincrone, mentre il backend (Node.js) funge da API Server.

## Endpoint API
- `GET /api/products`: Recupera il catalogo dal database Supabase.
- `GET /api/user/1`: Recupera il saldo crediti dell'utente.
- `POST /api/buy`: Gestisce l'acquisto verificando stock e crediti.
- `POST /api/products`: Permette all'admin di aggiungere nuovi prodotti.

## Sicurezza
I controlli di validità sono implementati **lato server** per prevenire transazioni non valide (crediti insufficienti o stock esaurito), garantendo l'integrità dei dati su Supabase.

## Link Progetto
- **Backend (Render):** https://verifica-tpsit.onrender.com
- **Frontend (GitHub Pages):** https://chocoys.github.io/Verifica-TPSIT/
