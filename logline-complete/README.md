# LogLine — Four Folders Layout

- **Engine/** — motor + `pack.yml` + policies de boot + binário (`bin/logline`)
- **Ruleset/** — regras `.lll` (system/app/tenant + `contrib/` importadas do teu `lllpack.zip`)
- **Timeline/** — Postgres (configs + migrations + scripts)
- **API/** — Gateway HTTP + setores: **LogLine ID** e **Onboarding** (extraídos do `logline_ws_api_full.zip` quando possível)

## Como rodar (local)
```bash
python3 -m pip install -r API/requirements.txt
bash Timeline/db/start.sh
bash run.sh
```

## Railway
Procfile já incluso (`web: bash run.sh`). Garanta um volume em `/data` e defina:
- `DATA_DIR=/data`
- `LOGLINE_ENGINE_BIN=./Engine/bin/logline` (troque pelo binário real)
- `DATABASE_URL=postgresql://logline:logline@127.0.0.1:5432/logline`
