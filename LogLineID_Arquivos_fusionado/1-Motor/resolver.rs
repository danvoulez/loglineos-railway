// resolver.rs - Resolve @nomes em LogLine IDs computáveis

pub fn resolve_handle(handle: &str) -> String {
    // Exemplo: "@danvoulez" -> "logline-id://danvoulez"
    if handle.starts_with('@') {
        format!("logline-id://{}", handle.trim_start_matches('@'))
    } else {
        handle.to_string()
    }
}

pub fn resolve_internal_id(internal_id: &str) -> String {
    // Exemplo: "logline-id://danvoulez" -> "@danvoulez"
    if internal_id.starts_with("logline-id://") {
        format!("@{}", internal_id.trim_start_matches("logline-id://"))
    } else {
        internal_id.to_string()
    }
}