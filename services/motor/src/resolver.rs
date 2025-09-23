use serde::{Deserialize, Serialize};
use anyhow::Result;

#[derive(Debug, Serialize, Deserialize)]
pub struct ResolveRequest {
    pub handle: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResolveResponse {
    pub found: bool,
    pub identity_id: Option<String>,
    pub entity_type: Option<String>,
    pub metadata: Option<serde_json::Value>,
    pub error: Option<String>,
}

pub async fn resolve_handle(handle: &str) -> Result<ResolveResponse> {
    // Remove @ prefix if present
    let clean_handle = handle.strip_prefix('@').unwrap_or(handle);
    
    // This would normally query the identity database
    // For simulation, provide some mock data
    if clean_handle == "danvoulez" {
        return Ok(ResolveResponse {
            found: true,
            identity_id: Some("logline-id://person.danvoulez".to_string()),
            entity_type: Some("person".to_string()),
            metadata: Some(serde_json::json!({
                "name": "Dan Voulez",
                "created_at": "2024-01-01T00:00:00Z",
                "verified": true
            })),
            error: None,
        });
    }

    Ok(ResolveResponse {
        found: false,
        identity_id: None,
        entity_type: None,
        metadata: None,
        error: Some("Identity not found".to_string()),
    })
}

pub fn format_identity_uri(entity_type: &str, handle: &str) -> String {
    format!("logline-id://{}.{}", entity_type, handle)
}

pub fn parse_identity_uri(uri: &str) -> Option<(String, String)> {
    if let Some(stripped) = uri.strip_prefix("logline-id://") {
        if let Some((entity_type, handle)) = stripped.split_once('.') {
            return Some((entity_type.to_string(), handle.to_string()));
        }
    }
    None
}