// identity_state.rs - Computação do estado de identidade

pub enum IdentityStatus {
    Ghost,
    Validado,
    Institucional,
}

pub fn transition_state(current: IdentityStatus, target: IdentityStatus) -> Result<IdentityStatus, &'static str> {
    match (current, target) {
        (IdentityStatus::Ghost, IdentityStatus::Validado) => Ok(IdentityStatus::Validado),
        (IdentityStatus::Validado, IdentityStatus::Institucional) => Ok(IdentityStatus::Institucional),
        _ => Err("Transição não permitida"),
    }
}