//! Consulta pública/institucional por LogLineID. 
//! Retorna erro rastreável se não encontrado.

use crate::logline_id::LogLineID;

pub fn query_logline_id(internal_id: &str, db: &dyn LogLineIDQuery) -> Result<LogLineID, &'static str> {
    match db.find_identity_by_internal_id(internal_id) {
        Some(identity) => Ok(identity),
        None => Err("LogLineID não encontrada")
    }
}

pub trait LogLineIDQuery {
    fn find_identity_by_internal_id(&self, internal_id: &str) -> Option<LogLineID>;
}