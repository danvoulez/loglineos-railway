use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LogLineIdentity {
    pub id: String,
    pub handle: String,
    pub entity_type: EntityType,
    pub created_at: DateTime<Utc>,
    pub created_by: Option<String>,
    pub metadata: HashMap<String, serde_json::Value>,
    pub status: IdentityStatus,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum EntityType {
    Person,
    Object,
    Contract,
    Rule,
    Timeline,
    App,
    Flow,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum IdentityStatus {
    Ghost,
    Active,
    Verified,
    Suspended,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateIdentityRequest {
    pub handle: String,
    pub entity_type: EntityType,
    pub metadata: HashMap<String, serde_json::Value>,
}

impl LogLineIdentity {
    pub fn new(handle: String, entity_type: EntityType, metadata: HashMap<String, serde_json::Value>) -> Self {
        let id = format!("logline-id://{}.{}", 
            match entity_type {
                EntityType::Person => "person",
                EntityType::Object => "object", 
                EntityType::Contract => "contract",
                EntityType::Rule => "rule",
                EntityType::Timeline => "timeline",
                EntityType::App => "app",
                EntityType::Flow => "flow",
            },
            handle
        );

        Self {
            id,
            handle,
            entity_type,
            created_at: Utc::now(),
            created_by: None,
            metadata,
            status: IdentityStatus::Ghost,
        }
    }

    pub fn to_handle(&self) -> String {
        format!("@{}", self.handle)
    }

    pub fn activate(&mut self) {
        self.status = IdentityStatus::Active;
    }

    pub fn verify(&mut self) {
        self.status = IdentityStatus::Verified;
    }
}