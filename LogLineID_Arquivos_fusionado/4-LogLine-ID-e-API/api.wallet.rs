//! Consulta computável de contratos/documentos emitidos para LogLineID

use crate::contract::Contract;

pub fn get_wallet(internal_id: &str, db: &dyn WalletQuery) -> Vec<Contract> {
    db.find_contracts_by_identity(internal_id)
}

pub trait WalletQuery {
    fn find_contracts_by_identity(&self, internal_id: &str) -> Vec<Contract>;
}