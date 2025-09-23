-- LogLine SQL - Postgres que encarna a consciência computável
-- Schema completo para registro imutável, auditável e reexecutável
-- ================================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela principal: registry computável
CREATE TABLE registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identidade computável LogLine
  logline_id TEXT NOT NULL,              -- logline-id://dan.amarilho
  entity_type TEXT NOT NULL,             -- person, agent, contract, span, etc
  
  -- Dados vivos computáveis
  payload JSONB NOT NULL,                -- Estrutura viva com campos dinâmicos
  file_ref TEXT,                         -- Caminho para arquivo (.lll, .pdf, etc)
  file_hash TEXT,                        -- Hash do arquivo para integridade
  
  -- Proveniência e auditoria
  provenance JSONB,                      -- De onde veio? Qual span causou?
  creator_id TEXT,                       -- logline-id do agente criador
  signature TEXT,                        -- Assinatura criptográfica (opcional)
  version INT DEFAULT 1,                 -- Versão do registro
  
  -- Tempo e contexto
  created_at TIMESTAMPTZ DEFAULT NOW(), -- Momento da inserção
  tenant_id TEXT,                        -- Multi-tenant (opcional)
  
  -- Metadados computáveis
  workflow_state TEXT DEFAULT 'active', -- Estado do fluxo
  is_executable BOOLEAN DEFAULT false,   -- Se o registro é executável
  execution_count INT DEFAULT 0         -- Quantas vezes foi executado
);

-- Índices para performance computável
CREATE INDEX idx_registry_logline_id ON registry(logline_id);
CREATE INDEX idx_registry_entity_type ON registry(entity_type);
CREATE INDEX idx_registry_created_at ON registry(created_at DESC);
CREATE INDEX idx_registry_workflow_state ON registry(workflow_state);
CREATE INDEX idx_registry_tenant ON registry(tenant_id);

-- Função para impedir modificações (append-only)
CREATE OR REPLACE FUNCTION prevent_modifications()
RETURNS trigger AS $$
BEGIN
  RAISE EXCEPTION 'LogLine Registry é append-only. UPDATE e DELETE não são permitidos. Use INSERT com nova versão.';
END;
$$ LANGUAGE plpgsql;

-- Trigger para garantir imutabilidade
CREATE TRIGGER no_modifications
BEFORE UPDATE OR DELETE ON registry
FOR EACH ROW EXECUTE FUNCTION prevent_modifications();

-- Função para auto-incrementar versão
CREATE OR REPLACE FUNCTION auto_increment_version()
RETURNS trigger AS $$
DECLARE
  max_version INT;
BEGIN
  -- Busca a maior versão existente para este logline_id
  SELECT COALESCE(MAX(version), 0) INTO max_version
  FROM registry
  WHERE logline_id = NEW.logline_id;
  
  -- Define a nova versão
  NEW.version := max_version + 1;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para auto-incrementar versão
CREATE TRIGGER auto_version
BEFORE INSERT ON registry
FOR EACH ROW EXECUTE FUNCTION auto_increment_version();

-- View: Última versão de cada entidade
CREATE VIEW registry_latest AS
SELECT DISTINCT ON (logline_id)
  *
FROM registry
ORDER BY logline_id, created_at DESC;

-- View: Registros ativos (não deletados logicamente)
CREATE VIEW registry_active AS
SELECT *
FROM registry_latest
WHERE workflow_state != 'deleted' AND workflow_state != 'archived';

-- View: Registros executáveis
CREATE VIEW registry_executable AS
SELECT *
FROM registry_active
WHERE is_executable = true;

-- Função para buscar último registro por logline_id
CREATE OR REPLACE FUNCTION get_latest_registry(p_logline_id TEXT)
RETURNS registry AS $$
DECLARE
  result registry;
BEGIN
  SELECT * INTO result
  FROM registry
  WHERE logline_id = p_logline_id
  ORDER BY created_at DESC
  LIMIT 1;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Função para buscar histórico completo
CREATE OR REPLACE FUNCTION get_registry_history(p_logline_id TEXT)
RETURNS SETOF registry AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM registry
  WHERE logline_id = p_logline_id
  ORDER BY created_at ASC;
END;
$$ LANGUAGE plpgsql;

-- Função para criar span de execução
CREATE OR REPLACE FUNCTION create_execution_span(
  p_logline_id TEXT,
  p_executor_id TEXT,
  p_execution_result JSONB
)
RETURNS UUID AS $$
DECLARE
  span_id UUID;
BEGIN
  span_id := gen_random_uuid();
  
  INSERT INTO registry (
    logline_id,
    entity_type,
    payload,
    provenance,
    creator_id
  ) VALUES (
    'logline-id://span.' || span_id::TEXT,
    'execution_span',
    jsonb_build_object(
      'executed_entity', p_logline_id,
      'executor', p_executor_id,
      'result', p_execution_result,
      'timestamp', NOW()
    ),
    jsonb_build_object('type', 'execution', 'source', 'registry_function'),
    p_executor_id
  );
  
  -- Incrementa contador de execução
  UPDATE registry 
  SET execution_count = execution_count + 1
  WHERE logline_id = p_logline_id 
  AND created_at = (
    SELECT MAX(created_at) 
    FROM registry 
    WHERE logline_id = p_logline_id
  );
  
  RETURN span_id;
END;
$$ LANGUAGE plpgsql;

-- Comentários para documentação
COMMENT ON TABLE registry IS 'LogLine Registry - Tabela append-only para registros computáveis imutáveis';
COMMENT ON COLUMN registry.logline_id IS 'Identidade computável universal (logline-id://...)';
COMMENT ON COLUMN registry.entity_type IS 'Tipo da entidade (person, agent, contract, span, etc)';
COMMENT ON COLUMN registry.payload IS 'Dados vivos em formato JSONB';
COMMENT ON COLUMN registry.provenance IS 'Rastreabilidade: de onde veio este registro';
COMMENT ON COLUMN registry.file_ref IS 'Referência para arquivo relacionado (.lll, .pdf, etc)';
COMMENT ON COLUMN registry.version IS 'Versão incremental do registro (auto-incrementada)';

-- Exemplo de uso
/*
-- Inserir uma nova pessoa
INSERT INTO registry (logline_id, entity_type, payload, provenance, creator_id)
VALUES (
  'logline-id://dan.amarilho',
  'person',
  '{"name": "Dan Amarilho", "email": "dan@danvoulez.com", "trust_level": "high"}',
  '{"source": "self_register", "ip": "192.168.1.100"}',
  'logline-id://dan.amarilho'
);

-- Buscar última versão
SELECT * FROM get_latest_registry('logline-id://dan.amarilho');

-- Buscar histórico completo
SELECT * FROM get_registry_history('logline-id://dan.amarilho');

-- Ver apenas registros ativos
SELECT * FROM registry_active WHERE entity_type = 'person';
*/