use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IdentityState {
    pub identity_id: String,
    pub current_status: String,
    pub properties: HashMap<String, serde_json::Value>,
    pub last_updated: chrono::DateTime<chrono::Utc>,
    pub version: u32,
}

impl IdentityState {
    pub fn new(identity_id: String) -> Self {
        Self {
            identity_id,
            current_status: "initialized".to_string(),
            properties: HashMap::new(),
            last_updated: chrono::Utc::now(),
            version: 1,
        }
    }

    pub fn update_property(&mut self, key: String, value: serde_json::Value) {
        self.properties.insert(key, value);
        self.last_updated = chrono::Utc::now();
        self.version += 1;
    }

    pub fn transition_to(&mut self, new_status: String) {
        self.current_status = new_status;
        self.last_updated = chrono::Utc::now();
        self.version += 1;
    }
}