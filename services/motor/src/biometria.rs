use serde::{Deserialize, Serialize};
use sha2::{Sha256, Digest};
use chrono::{DateTime, Utc};
use anyhow::Result;

#[derive(Debug, Serialize, Deserialize)]
pub struct BiometriaRequest {
    pub session_id: String,
    pub biometric_data: String,
    pub biometric_type: BiometricType,
    pub quality_score: f32,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum BiometricType {
    FaceEmbedding,
    Fingerprint,
    Iris,
    Voice,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BiometriaResponse {
    pub verified: bool,
    pub confidence: f32,
    pub match_quality: f32,
    pub processing_time_ms: u64,
    pub matched_identity: Option<String>,
    pub error: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricRecord {
    pub identity_id: String,
    pub biometric_hash: String,
    pub biometric_type: BiometricType,
    pub created_at: DateTime<Utc>,
    pub quality_metrics: BiometricQuality,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BiometricQuality {
    pub resolution: f32,
    pub clarity: f32,
    pub angle_deviation: f32,
    pub lighting_score: f32,
}

pub async fn process_biometria_verification(request: BiometriaRequest) -> BiometriaResponse {
    let start_time = std::time::Instant::now();

    // Hash the biometric data for privacy
    let biometric_hash = hash_biometric_data(&request.biometric_data);
    
    // Simulate biometric matching process
    let (verified, confidence, matched_identity) = match_biometric(&biometric_hash, &request.biometric_type).await;
    
    let processing_time = start_time.elapsed().as_millis() as u64;

    BiometriaResponse {
        verified,
        confidence,
        match_quality: request.quality_score,
        processing_time_ms: processing_time,
        matched_identity,
        error: None,
    }
}

fn hash_biometric_data(data: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(data.as_bytes());
    hex::encode(hasher.finalize())
}

async fn match_biometric(biometric_hash: &str, biometric_type: &BiometricType) -> (bool, f32, Option<String>) {
    // This would normally query a secure biometric database
    // For now, simulate matching logic
    
    let confidence = match biometric_type {
        BiometricType::FaceEmbedding => 0.87,
        BiometricType::Fingerprint => 0.92,
        BiometricType::Iris => 0.95,
        BiometricType::Voice => 0.78,
    };

    let verified = confidence > 0.8;
    let matched_identity = if verified {
        Some("logline-id://person.matched_user".to_string())
    } else {
        None
    };

    (verified, confidence, matched_identity)
}

pub fn create_biometric_record(
    identity_id: String,
    biometric_data: String,
    biometric_type: BiometricType,
    quality: BiometricQuality,
) -> BiometricRecord {
    BiometricRecord {
        identity_id,
        biometric_hash: hash_biometric_data(&biometric_data),
        biometric_type,
        created_at: Utc::now(),
        quality_metrics: quality,
    }
}