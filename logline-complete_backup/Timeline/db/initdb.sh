#!/usr/bin/env bash
set -euo pipefail
: "${DATA_DIR:=/data}"
PGDATA="$DATA_DIR/pg"
LOGDIR="$DATA_DIR/logs"
mkdir -p "$PGDATA" "$LOGDIR"
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  echo "[pg] initdb in $PGDATA"
  initdb -D "$PGDATA" -U logline -E UTF8 >/dev/null
  cp Timeline/configs/postgresql.conf "$PGDATA/postgresql.conf"
  cp Timeline/configs/pg_hba.conf "$PGDATA/pg_hba.conf"
fi
