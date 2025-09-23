// ghost.rs - Comportamento computável do modo ghost

pub struct GhostIdentity {
    pub handle: String,
    pub internal_id: String,
    pub created_at: String,
    pub expiration: String,
    pub permissions: Vec<String>,
}

pub fn is_ghost_expired(identity: &GhostIdentity, current_time: &str) -> bool {
    // Compara expiration com current_time
    current_time >= identity.expiration
}