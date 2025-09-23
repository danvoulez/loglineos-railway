#!/usr/bin/env bash
set -euo pipefail
: "${DATA_DIR:=/data}"
PGDATA="$DATA_DIR/pg"
LOGDIR="$DATA_DIR/logs"
mkdir -p "$PGDATA" "$LOGDIR"
bash Timeline/db/initdb.sh
pg_ctl -D "$PGDATA" -l "$LOGDIR/postgres.log" -o "-c config_file=$PGDATA/postgresql.conf" start
# Wait for ready
for i in {1..60}; do
  if psql -h 127.0.0.1 -U logline -d postgres -Atqc "select 1" >/dev/null 2>&1; then
    break
  fi
  sleep 1
done
# Ensure DB and extensions
createdb -h 127.0.0.1 -U logline logline || true
psql -h 127.0.0.1 -U logline -d logline -Atqc "create extension if not exists pgcrypto" || true
psql -h 127.0.0.1 -U logline -d logline -Atqc "create extension if not exists "uuid-ossp"" || true
# Apply migrations
for f in Timeline/migrations/*.sql; do
  [ -e "$f" ] || continue
  echo "[pg] applying $f"
  psql -h 127.0.0.1 -U logline -d logline -f "$f"
done
echo "[pg] ready"
