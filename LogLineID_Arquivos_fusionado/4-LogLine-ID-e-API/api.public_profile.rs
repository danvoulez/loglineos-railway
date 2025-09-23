//! Consulta pública do perfil computável de um LogLineID. 
//! Retorna dados rastreáveis e filtrados.

use crate::logline_id::{LogLineID, Status};

#[derive(Debug, Clone, serde::Serialize)]
pub struct PublicProfile {
    pub handle: String,
    pub status: Status,
    pub trust_score: f32,
    pub span_count: usize
}

pub fn public_profile(internal_id: &str, db: &dyn LogLineIDQuery, spans: &dyn SpanQuery) -> Result<PublicProfile, &'static str> {
    let identity = query_logline_id(internal_id, db)?;
    if identity.status == Status::Ghost || identity.status == Status::Revogado {
        return Err("Identidade não está autorizada para perfil público");
    }
    Ok(PublicProfile {
        handle: identity.handle,
        status: identity.status,
        trust_score: identity.trust_score,
        span_count: spans.count_spans(internal_id)
    })
}

pub trait SpanQuery {
    fn count_spans(&self, internal_id: &str) -> usize;
}