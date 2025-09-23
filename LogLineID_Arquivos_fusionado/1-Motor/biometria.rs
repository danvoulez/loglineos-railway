// biometria.rs - Validação computável de embedding facial e vocal

pub struct BiometriaFacial {
    pub embedding: Vec<f32>,
    pub score: f32,
    pub last_verified: String,
}

pub struct BiometriaVocal {
    pub embedding: Vec<f32>,
    pub score: f32,
    pub last_verified: String,
}

pub fn validate_biometria(score: f32, threshold: f32) -> bool {
    score >= threshold
}