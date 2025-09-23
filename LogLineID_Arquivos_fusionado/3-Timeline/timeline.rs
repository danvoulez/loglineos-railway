//! timeline.rs - Núcleo computável da Timeline LogLineID.
//! Gerencia spans de eventos de identidade, serialização, validação e auditoria.

use chrono::{DateTime, Utc};
use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone, PartialEq, Eq)]
pub enum SpanType {
    IdentityCreated,
    GhostLogin,
    BiometriaValidada,
    RfidValidado,
    IdentityTransitioned,
    Deleted,
    Recoverable,
    ContractSigned,
    FingerprintOnboarding,
    RfidOnboarding,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Span {
    pub span_id: String,             // UUID do evento
    pub span_type: SpanType,         // Tipo do evento
    pub created_at: DateTime<Utc>,   // Timestamp computável
    pub internal_id: String,         // logline-id://...
    pub handle: String,              // @handle
    pub provenance: String,          // onboarding, transition, revocation, recovery
    pub agent: String,               // logline-id://...
    pub details: Option<serde_json::Value>, // Dados extras
}

impl Span {
    /// Cria um novo span computável de evento de identidade
    pub fn new(span_type: SpanType, internal_id: &str, handle: &str, provenance: &str, agent: &str, details: Option<serde_json::Value>) -> Self {
        Span {
            span_id: uuid::Uuid::new_v4().to_string(),
            span_type,
            created_at: Utc::now(),
            internal_id: internal_id.to_string(),
            handle: handle.to_string(),
            provenance: provenance.to_string(),
            agent: agent.to_string(),
            details,
        }
    }

    /// Serializa para JSON rastreável
    pub fn to_json(&self) -> String {
        serde_json::to_string_pretty(self).expect("Erro ao serializar Span")
    }

    /// Valida campos obrigatórios e retorna inconsistências
    pub fn audit(&self) -> Vec<String> {
        let mut inconsistencies = vec![];
        if self.span_id.is_empty() { inconsistencies.push("span_id vazio".to_string()); }
        if self.internal_id.is_empty() { inconsistencies.push("internal_id vazio".to_string()); }
        if self.handle.is_empty() { inconsistencies.push("handle vazio".to_string()); }
        if self.agent.is_empty() { inconsistencies.push("agent vazio".to_string()); }
        // Outras validações específicas por tipo podem ser adicionadas aqui
        inconsistencies
    }
}

/// Exemplo de criação de spans computáveis:

fn example_spans() {
    // Span de criação de identidade
    let span1 = Span::new(
        SpanType::IdentityCreated,
        "logline-id://danvoulez",
        "@danvoulez",
        "onboarding",
        "logline-id://danvoulez",
        None
    );
    println!("{}", span1.to_json());

    // Span de validação biométrica
    let details = serde_json::json!({
        "score": 0.97,
        "method": "biometria_facial"
    });
    let span2 = Span::new(
        SpanType::BiometriaValidada,
        "logline-id://danvoulez",
        "@danvoulez",
        "onboarding",
        "logline-id://danvoulez",
        Some(details)
    );
    println!("{}", span2.to_json());
}