//! Resolve @username para logline-id://... (API pública/institucional)
//! Valida formato e retorna erro rastreável se inválido.

pub fn resolve_username(handle: &str) -> Result<String, &'static str> {
    if handle.starts_with('@') && handle.len() > 1 {
        Ok(format!("logline-id://{}", &handle[1..]))
    } else {
        Err("Handle inválido: deve começar com '@' e ter pelo menos 2 caracteres")
    }
}