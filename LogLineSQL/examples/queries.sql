-- LogLine SQL - Exemplos de Uso
-- ================================

-- 1. INSERIR NOVA PESSOA
INSERT INTO registry (logline_id, entity_type, payload, provenance, creator_id, file_ref)
VALUES (
  'logline-id://dan.amarilho',
  'person',
  '{
    "name": "Dan Amarilho",
    "email": "dan@danvoulez.com",
    "trust_level": "high",
    "permissions": ["create_contracts", "manage_identity"]
  }',
  '{"source": "self_register", "ip": "192.168.1.100"}',
  'logline-id://dan.amarilho',
  'registry_store/logline-id:--dan.amarilho/dan_identity_card.pdf'
);

-- 2. INSERIR AGENTE LLM
INSERT INTO registry (logline_id, entity_type, payload, provenance, creator_id, is_executable)
VALUES (
  'logline-id://agent.curador',
  'agent',
  '{
    "name": "Agente Curador",
    "type": "llm_assistant",
    "capabilities": ["content_curation", "quality_assessment"],
    "model": "gpt-4",
    "trust_level": "system"
  }',
  '{"source": "system_init", "creator": "logline-id://system"}',
  'logline-id://system',
  true
);

-- 3. INSERIR CONTRATO COMPUTÁVEL
INSERT INTO registry (logline_id, entity_type, payload, provenance, creator_id, file_ref, is_executable)
VALUES (
  'logline-id://contract.bike_loan',
  'contract',
  '{
    "title": "Empréstimo de Bicicleta",
    "parties": ["@dan", "@maria"],
    "terms": {
      "item": "bicicleta_vermelha",
      "duration": "1_week",
      "location": "@casa_maria"
    },
    "status": "active"
  }',
  '{"source": "minicontratos_app", "contract_template": "bike_loan.lll"}',
  'logline-id://dan.amarilho',
  'contracts/bike_loan_001.lll',
  true
);

-- 4. ATUALIZAR PESSOA (NOVA VERSÃO)
INSERT INTO registry (logline_id, entity_type, payload, provenance, creator_id)
VALUES (
  'logline-id://dan.amarilho',  -- Mesmo logline_id
  'person',
  '{
    "name": "Dan Amarilho",
    "email": "dan@danvoulez.com",
    "trust_level": "maximum",
    "permissions": ["create_contracts", "manage_identity", "admin_access"],
    "phone": "+55 11 99999-9999"
  }',
  '{"source": "profile_update", "updated_fields": ["trust_level", "permissions", "phone"]}',
  'logline-id://dan.amarilho'
);

-- 5. BUSCAR ÚLTIMA VERSÃO DE UMA PESSOA
SELECT * FROM get_latest_registry('logline-id://dan.amarilho');

-- 6. BUSCAR HISTÓRICO COMPLETO
SELECT 
  version,
  created_at,
  payload->>'trust_level' as trust_level,
  payload->>'email' as email,
  provenance->>'source' as source
FROM get_registry_history('logline-id://dan.amarilho')
ORDER BY version;

-- 7. LISTAR TODAS AS PESSOAS ATIVAS
SELECT 
  logline_id,
  payload->>'name' as name,
  payload->>'email' as email,
  payload->>'trust_level' as trust_level,
  created_at
FROM registry_active 
WHERE entity_type = 'person'
ORDER BY created_at DESC;

-- 8. LISTAR CONTRATOS EXECUTÁVEIS
SELECT 
  logline_id,
  payload->>'title' as title,
  payload->>'status' as status,
  file_ref,
  execution_count
FROM registry_executable 
WHERE entity_type = 'contract'
ORDER BY created_at DESC;

-- 9. BUSCAR POR CAMPO NO PAYLOAD
SELECT 
  logline_id,
  payload->>'name' as name,
  payload->>'trust_level' as trust_level
FROM registry_latest 
WHERE entity_type = 'person'
  AND payload->>'trust_level' = 'high';

-- 10. CRIAR SPAN DE EXECUÇÃO
SELECT create_execution_span(
  'logline-id://contract.bike_loan',
  'logline-id://dan.amarilho',
  '{"action": "contract_fulfilled", "status": "success", "returned_at": "2025-09-30T10:00:00Z"}'
);

-- 11. BUSCAR ENTIDADES POR CRIADOR
SELECT 
  logline_id,
  entity_type,
  payload->>'name' as name,
  created_at
FROM registry_active
WHERE creator_id = 'logline-id://dan.amarilho'
ORDER BY created_at DESC;

-- 12. ESTATÍSTICAS DO REGISTRY
SELECT 
  entity_type,
  COUNT(*) as total_records,
  COUNT(DISTINCT logline_id) as unique_entities,
  MAX(created_at) as last_update
FROM registry
GROUP BY entity_type
ORDER BY total_records DESC;

-- 13. ENTIDADES COM ARQUIVOS
SELECT 
  logline_id,
  entity_type,
  payload->>'name' as name,
  file_ref,
  file_hash
FROM registry_latest
WHERE file_ref IS NOT NULL
ORDER BY created_at DESC;

-- 14. BUSCAR POR TENANT (MULTI-TENANT)
SELECT 
  logline_id,
  entity_type,
  payload->>'name' as name
FROM registry_active
WHERE tenant_id = 'voulezvous_org'
ORDER BY created_at DESC;

-- 15. ENTIDADES MAIS EXECUTADAS
SELECT 
  logline_id,
  entity_type,
  payload->>'name' as name,
  execution_count
FROM registry_latest
WHERE execution_count > 0
ORDER BY execution_count DESC
LIMIT 10;