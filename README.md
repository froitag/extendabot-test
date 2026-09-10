# Counter

Kleine Next.js-App mit einem Zähler. Der aktuelle Wert liegt in PostgreSQL.

## Starten

1. PostgreSQL aus dem Dockerfile starten:

```bash
docker compose up -d --build
```

2. Umgebungsvariablen setzen:

```bash
cp .env.example .env.local
```

3. App starten:

```bash
npm install
npm run dev
```

Die App läuft unter [http://localhost:3000](http://localhost:3000). Ein Klick auf **Erhöhen** speichert den neuen Wert in der Datenbank.

## API

- `GET /api/counter` — aktuellen Wert lesen
- `POST /api/counter` — Wert um 1 erhöhen
