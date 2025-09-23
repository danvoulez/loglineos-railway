#!/usr/bin/env bash
set -euo pipefail

: "${PORT:=3000}"
: "${DATA_DIR:=/data}"
: "${LOGLINE_ENGINE_BIN:=./Engine/bin/logline}"
: "${DATABASE_URL:=postgresql://logline:logline@127.0.0.1:5432/logline}"

mkdir -p "$DATA_DIR/logs"

echo "[boot] starting Timeline/Postgres ..."
bash Timeline/db/start.sh &
PG_PID=$!

echo "[boot] starting Engine ..."
if [ -x "$LOGLINE_ENGINE_BIN" ]; then
  "$LOGLINE_ENGINE_BIN" --engine --ruleset Ruleset/system.lll --bind 127.0.0.1:7070 >> "$DATA_DIR/logs/engine.log" 2>&1 &
  ENGINE_PID=$!
else
  echo "[engine] WARN: binary not found or not executable at $LOGLINE_ENGINE_BIN; running STUB"
  ( while true; do echo "[engine] stub alive"; sleep 30; done ) >> "$DATA_DIR/logs/engine.log" 2>&1 &
  ENGINE_PID=$!
fi

echo "[boot] starting API ... (:${PORT})"
python3 -m pip install -r API/requirements.txt >/dev/null 2>&1 || true
python3 -m uvicorn API.main:app --host 0.0.0.0 --port "${PORT}" &
API_PID=$!

touch "$DATA_DIR/logs/postgres.log" "$DATA_DIR/logs/engine.log"
tail -n +1 -f "$DATA_DIR/logs/postgres.log" "$DATA_DIR/logs/engine.log" &
TAIL_PID=$!

trap 'echo "[boot] stopping..."; kill $API_PID $ENGINE_PID $PG_PID $TAIL_PID 2>/dev/null || true; sleep 1; exit 0' SIGTERM SIGINT

echo "[boot] all processes started (pg:$PG_PID engine:$ENGINE_PID api:$API_PID); waiting..."
wait $API_PID
