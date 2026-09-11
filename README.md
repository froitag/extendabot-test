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

## Deploy mit Extendabot

`publish_auto` schreibt die Live-URL auf das **Project**. Eine mit `create_sandbox` erzeugte Box erscheint unter Sandboxes, nicht als Project-Deployment.

Der Planner kann nur einen Compose-Service erzeugen. Deshalb startet `deploy/start.sh` Postgres und Next.js im selben Container. `DATABASE_URL` muss auf `127.0.0.1` zeigen:

```bash
npx extendabot-cli login --wait
npx extendabot-cli set_project_environment_entry \
  --organization-id <org-id> \
  --project-id <project-id> \
  --name DATABASE_URL \
  --kind secret \
  --value 'postgres://counter:counter@127.0.0.1:5432/counter'
npx extendabot-cli publish_auto \
  --organization-id <org-id> \
  --project-id <project-id> \
  --display-name "Counter" \
  --auto-stop-interval-minutes 43200 \
  --spec "$(cat deploy/extendabot-spec.json)" \
  .
```

## API

- `GET /api/counter` — aktuellen Wert lesen
- `POST /api/counter` — Wert um 1 erhöhen
