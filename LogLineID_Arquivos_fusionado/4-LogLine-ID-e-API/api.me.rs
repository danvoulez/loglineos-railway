//! GET /me autenticado. Retorna identidade computável do usuário autenticado.

use crate::logline_id::LogLineID;

pub fn get_me(auth_token: &str, db: &dyn LogLineIDQuery, auth: &dyn AuthProvider) -> Result<LogLineID, &'static str> {
    match auth.validate_token(auth_token) {
        Some(user_id) => query_logline_id(&user_id, db),
        None => Err("Token de autenticação inválido")
    }
}

pub trait AuthProvider {
    fn validate_token(&self, token: &str) -> Option<String>;
}