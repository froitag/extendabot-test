#!/bin/sh
set -eu

export PGDATA="${PGDATA:-/var/lib/postgresql/data}"
export DATABASE_URL="${DATABASE_URL:-postgres://counter:counter@127.0.0.1:5432/counter}"
export HOSTNAME=0.0.0.0
export PORT="${PORT:-3000}"

mkdir -p "$PGDATA" /run/postgresql
chown -R postgres:postgres "$PGDATA" /run/postgresql
chmod 700 "$PGDATA"

if [ ! -f "$PGDATA/PG_VERSION" ]; then
  su -s /bin/sh postgres -c "initdb -D '$PGDATA' --auth-local=trust --auth-host=trust"
fi

cat > "$PGDATA/pg_hba.conf" <<'EOF'
local   all             all                                     trust
host    all             all             127.0.0.1/32          trust
host    all             all             ::1/128                trust
EOF
chown postgres:postgres "$PGDATA/pg_hba.conf"

if ! su -s /bin/sh postgres -c "pg_ctl -D '$PGDATA' status" >/dev/null 2>&1; then
  su -s /bin/sh postgres -c "pg_ctl -D '$PGDATA' -o '-c listen_addresses=127.0.0.1 -c unix_socket_directories=/run/postgresql' -w start"
fi

for _ in 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20; do
  if su -s /bin/sh postgres -c "pg_isready -h 127.0.0.1 -p 5432" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done

if ! su -s /bin/sh postgres -c "psql -d postgres -tAc \"SELECT 1 FROM pg_roles WHERE rolname='counter'\"" | grep -q 1; then
  su -s /bin/sh postgres -c "psql -d postgres -c \"CREATE ROLE counter LOGIN PASSWORD 'counter'\""
fi
if ! su -s /bin/sh postgres -c "psql -d postgres -tAc \"SELECT 1 FROM pg_database WHERE datname='counter'\"" | grep -q 1; then
  su -s /bin/sh postgres -c "psql -d postgres -c \"CREATE DATABASE counter OWNER counter\""
fi

cd /app
if [ -f /app/.next/standalone/server.js ]; then
  mkdir -p /app/.next/standalone/.next /app/.next/standalone/public
  cp -a /app/.next/static /app/.next/standalone/.next/static
  if [ -d /app/public ]; then
    cp -a /app/public/. /app/.next/standalone/public/
  fi
  cd /app/.next/standalone
  exec node server.js
fi

exec npx next start --hostname 0.0.0.0 --port 3000
