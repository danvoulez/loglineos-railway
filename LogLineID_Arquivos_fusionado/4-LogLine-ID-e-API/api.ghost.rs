//! Criação, uso e revogação computável de ghost IDs, rastreável e validado.

use crate::logline_id::{LogLineID, Status, Origin};

pub fn create_ghost_id(handle: &str, expiration: &str) -> LogLineID {
    LogLineID {
        internal_id: format!("logline-id://{}", handle.trim_start_matches('@')),
        handle: handle.to_string(),
        origin: Origin::Humano,
        created_at: chrono::Utc::now(),
        status: Status::Ghost,
        auth_methods: vec![],
        roles: vec![],
        trust_score: 0.0,
        permissions: vec!["view timeline".to_string(), "create spans".to_string()],
    }
}

pub fn revoke_ghost_id(internal_id: &str, db: &mut dyn LogLineIDMutate) -> Result<(), &'static str> {
    db.set_identity_status(internal_id, Status::Revogado)
}

pub trait LogLineIDMutate {
    fn set_identity_status(&mut self, internal_id: &str, status: Status) -> Result<(), &'static str>;
}