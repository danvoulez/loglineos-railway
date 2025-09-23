use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use std::collections::HashMap;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct GhostSession {
    pub id: String,
    pub device_id: String,
    pub created_at: DateTime<Utc>,
    pub last_activity: DateTime<Utc>,
    pub metadata: HashMap<String, serde_json::Value>,
    pub status: GhostStatus,
    pub transition_data: Option<TransitionData>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum GhostStatus {
    Active,
    Transitioning,
    Converted,
    Expired,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct TransitionData {
    pub biometric_hash: Option<String>,
    pub verification_attempts: u32,
    pub last_verification: Option<DateTime<Utc>>,
    pub matched_identity: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateGhostRequest {
    pub device_id: String,
    pub metadata: HashMap<String, serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GhostTransitionRequest {
    pub session_id: String,
    pub biometric_data: String,
    pub verification_method: VerificationMethod,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum VerificationMethod {
    FaceMatch,
    Fingerprint,
    RFID,
    Manual,
}

impl GhostSession {
    pub fn new(device_id: String, metadata: HashMap<String, serde_json::Value>) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            device_id,
            created_at: Utc::now(),
            last_activity: Utc::now(),
            metadata,
            status: GhostStatus::Active,
            transition_data: None,
        }
    }

    pub fn start_transition(&mut self, biometric_hash: String) {
        self.status = GhostStatus::Transitioning;
        self.transition_data = Some(TransitionData {
            biometric_hash: Some(biometric_hash),
            verification_attempts: 0,
            last_verification: None,
            matched_identity: None,
        });
    }

    pub fn update_activity(&mut self) {
        self.last_activity = Utc::now();
    }

    pub fn is_expired(&self) -> bool {
        let expiry_duration = chrono::Duration::hours(24); // Ghost sessions expire after 24 hours
        Utc::now() - self.created_at > expiry_duration
    }

    pub fn complete_transition(&mut self, identity_id: String) {
        self.status = GhostStatus::Converted;
        if let Some(ref mut data) = self.transition_data {
            data.matched_identity = Some(identity_id);
        }
    }
}