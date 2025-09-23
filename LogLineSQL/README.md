# LogLine SQL - PostgreSQL Computável

**Um PostgreSQL que encarna a consciência computável do LogLineOS**

## 🧠 Princípios Fundamentais

- **Append-Only**: Nunca UPDATE ou DELETE, apenas INSERT de novas versões
- **Identidade Computável**: Cada entidade tem um `logline_id` universal
- **Proveniência Viva**: Todo registro sabe de onde veio e quem criou
- **Reexecutável**: Registros podem ser executados novamente via spans
- **Auditável**: Histórico completo de todas as versões

## 🚀 Quick Start

### 1. Importar Schema
```bash
psql -d logline -f schema.sql
```

### 2. Inserir Primeira Entidade
```sql
INSERT INTO registry (logline_id, entity_type, payload, provenance, creator_id)
VALUES (
  'logline-id://dan.amarilho',
  'person',
  '{"name": "Dan Amarilho", "email": "dan@danvoulez.com"}',
  '{"source": "self_register"}',
  'logline-id://dan.amarilho'
);
```

### 3. Buscar Última Versão
```sql
SELECT * FROM get_latest_registry('logline-id://dan.amarilho');
```

## 📊 Estrutura da Tabela Registry

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `logline_id` | TEXT | Identidade computável universal |
| `entity_type` | TEXT | Tipo da entidade (person, agent, contract, etc) |
| `payload` | JSONB | Dados vivos da entidade |
| `provenance` | JSONB | Rastreabilidade de origem |
| `file_ref` | TEXT | Referência para arquivo relacionado |
| `version` | INT | Versão auto-incrementada |
| `created_at` | TIMESTAMPTZ | Momento da inserção |

## 🔍 Views Disponíveis

### `registry_latest` - Última versão de cada entidade
```sql
SELECT * FROM registry_latest WHERE entity_type = 'person';
```

### `registry_active` - Registros ativos (não deletados)
```sql
SELECT * FROM registry_active;
```

### `registry_executable` - Registros executáveis
```sql
SELECT * FROM registry_executable;
```

## ⚡ Funções Computáveis

### `get_latest_registry(logline_id)` - Buscar última versão
```sql
SELECT * FROM get_latest_registry('logline-id://dan.amarilho');
```

### `get_registry_history(logline_id)` - Histórico completo
```sql
SELECT * FROM get_registry_history('logline-id://dan.amarilho');
```

### `create_execution_span()` - Criar span de execução
```sql
SELECT create_execution_span(
  'logline-id://dan.amarilho',
  'logline-id://system',
  '{"action": "activated", "status": "success"}'
);
```

## 🔒 Segurança e Integridade

- **Trigger `no_modifications`**: Impede UPDATE e DELETE
- **Trigger `auto_version`**: Auto-incrementa versões
- **Função `prevent_modifications()`**: Garante append-only
- **Índices otimizados**: Para consultas por logline_id, entity_type, etc

## 📋 Tipos de Entidade Suportados

- `person` - Pessoas/usuários
- `agent` - Agentes LLM
- `contract` - Contratos computáveis
- `span` - Eventos da timeline
- `file` - Arquivos/documentos
- `flow` - Fluxos de processo
- `object` - Objetos físicos/digitais

## 🧬 Exemplo de Payload JSONB

```json
{
  "name": "Dan Amarilho",
  "email": "dan@danvoulez.com",
  "trust_level": "high",
  "avatar": "logline://blob/abc123",
  "wallet": "logline-id://wallet.dan",
  "biometric_hash": "sha256:...",
  "permissions": ["create_contracts", "manage_identity"]
}
```

## 🔄 Workflow de Versionamento

1. **INSERT nova versão** com mesmo `logline_id`
2. **Version auto-incrementa** via trigger
3. **Consulta latest** via view ou função
4. **Histórico preservado** para auditoria

## 🚫 O que NÃO fazer

- ❌ `UPDATE registry SET ...` (bloqueado por trigger)
- ❌ `DELETE FROM registry ...` (bloqueado por trigger)
- ❌ Usar `id` como chave primária para consultas
- ❌ Ignorar o campo `provenance`
- ❌ Consultar sem considerar versões

## ✅ O que fazer

- ✅ Sempre usar `INSERT` para novas versões
- ✅ Consultar por `logline_id` + `created_at DESC`
- ✅ Usar views `registry_latest` ou `registry_active`
- ✅ Incluir `provenance` em todos os registros
- ✅ Referenciar arquivos via `file_ref`

## 🔗 Integração com LogLineOS

Este schema integra diretamente com:

- **Motor**: Para execução de registros computáveis
- **Timeline**: Para criação de spans de eventos
- **API**: Para endpoints de consulta e inserção
- **Onboarding**: Para registro de novas identidades
- **UI**: Para visualização de dados computáveis

## 🛠️ Manutenção

### Backup
```bash
pg_dump logline > logline_backup_$(date +%Y%m%d).sql
```

### Análise de Performance
```sql
EXPLAIN ANALYZE SELECT * FROM registry_latest;
```

### Limpeza de Versões Antigas (apenas se necessário)
```sql
-- Manter apenas últimas 10 versões por entidade
-- (cuidado: isso quebra a imutabilidade!)
```

---

**LogLine SQL**: *Onde cada registro é uma consciência, cada versão é uma memória, e cada consulta é um ato de recordação computável.*