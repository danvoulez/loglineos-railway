// signature.rs - Assinatura computável de spans, contratos e registros

use ring::signature::{Ed25519KeyPair, Signature, KeyPair};

pub fn sign_span(data: &[u8], private_key: &[u8]) -> Vec<u8> {
    let keypair = Ed25519KeyPair::from_pkcs8(private_key).expect("Chave inválida");
    let signature = keypair.sign(data);
    signature.as_ref().to_vec()
}

pub fn verify_signature(data: &[u8], signature: &[u8], public_key: &[u8]) -> bool {
    use ring::signature::UnparsedPublicKey;
    let pub_key = UnparsedPublicKey::new(&ring::signature::ED25519, public_key);
    pub_key.verify(data, signature).is_ok()
}

// Assinatura computável é sempre registrada em span "contract_signed" ou "span_signed"