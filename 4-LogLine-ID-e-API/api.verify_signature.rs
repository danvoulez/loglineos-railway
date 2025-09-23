//! Valida assinaturas computáveis emitidas por um LogLineID. 
//! Retorna erro rastreável.

use crate::signature;

pub fn verify_logline_signature(internal_id: &str, data: &[u8], signature: &[u8], db: &dyn PublicKeyQuery) -> Result<bool, &'static str> {
    match db.get_public_key(internal_id) {
        Some(public_key) => Ok(signature::verify_signature(data, signature, &public_key)),
        None => Err("Chave pública não encontrada para este LogLineID")
    }
}

pub trait PublicKeyQuery {
    fn get_public_key(&self, internal_id: &str) -> Option<Vec<u8>>;
}