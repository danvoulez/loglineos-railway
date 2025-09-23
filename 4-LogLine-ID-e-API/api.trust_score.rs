//! Retorna score computável de confiança pública

use crate::logline_id::LogLineID;

pub fn get_trust_score(internal_id: &str, db: &dyn LogLineIDQuery) -> Result<f32, &'static str> {
    let identity = query_logline_id(internal_id, db)?;
    Ok(identity.trust_score)
}