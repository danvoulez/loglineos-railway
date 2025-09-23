//! logline_id.rs - Núcleo computável da identidade LogLineID.
//! Estrutura robusta, rastreável, serializável, validada e auditável.
//! Inclui métodos concretos para produção institucional e onboarding.

use uuid::Uuid;
use chrono::{Utc, DateTime};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub enum Origin {
    Humano,
    Objeto,
    Nó,
    Agente,
    Institucional,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub enum Status {
    Ghost,
    Validado,
    Institucional,
    Revogado,
}

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub enum AuthMethod {
    Senha,
    BiometriaFacial,
    BiometriaVocal,
    RFID,
    Fingerprint,
    GhostToken,
    Contrato,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LogLineID {
    pub internal_id: String,      // logline-id://danvoulez
    pub handle: String,           // @danvoulez
    pub origin: Origin,
    pub created_at: DateTime<Utc>,
    pub status: Status,
    pub auth_methods: Vec<AuthMethod>,
    pub roles: Vec<String>,
    pub trust_score: f32,
    pub permissions: Vec<String>,
}

impl LogLineID {
    /// Cria uma nova identidade computável, validada desde o início.
    pub fn new(handle: &str, origin: Origin, status: Status, auth_methods: Vec<AuthMethod>, roles: Vec<String>) -> Self {
        let internal_id = format!("logline-id://{}", handle.trim_start_matches('@'));
        LogLineID {
            internal_id,
            handle: handle.to_string(),
            origin,
            created_at: Utc::now(),
            status,
            auth_methods,
            roles,
            trust_score: 80.0,
            permissions: vec![
                "view timeline".to_string(),
                "create spans".to_string(),
                "assinar contratos".to_string()
            ],
        }
    }

    /// Verifica se a identidade está apta para uso institucional
    pub fn is_valid(&self) -> bool {
        matches!(self.status, Status::Validado | Status::Institucional)
    }

    /// Serializa para JSON rastreável
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(self).expect("Erro ao serializar LogLineID")
    }

    /// Realiza parsing reverso (handle ou internal_id)
    pub fn parse(input: &str) -> Option<Self> {
        if input.starts_with("logline-id://") {
            let handle = format!("@{}", input.trim_start_matches("logline-id://"));
            Some(LogLineID::new(
                &handle,
                Origin::Humano,
                Status::Validado,
                vec![],
                vec![],
            ))
        } else if input.starts_with('@') {
            let internal_id = format!("logline-id://{}", input.trim_start_matches('@'));
            Some(LogLineID::new(
                input,
                Origin::Humano,
                Status::Validado,
                vec![],
                vec![],
            ))
        } else {
            None
        }
    }

    /// Auditoria computável: retorna inconsistências encontradas
    pub fn audit(&self) -> Vec<String> {
        let mut inconsistencies = Vec::new();
        if self.handle.is_empty() || !self.internal_id.starts_with("logline-id://") {
            inconsistencies.push("Identidade inválida: handle vazio ou internal_id mal formatado.".to_string());
        }
        if !self.is_valid() {
            inconsistencies.push("Status não apto para uso institucional.".to_string());
        }
        // Outras regras podem ser adicionadas aqui
        inconsistencies
    }
}