// rfid.rs - Validação computável de RFID

pub struct RFIDTag {
    pub serial: String,
    pub status: String, // ativo, revogado, expirado
    pub bound_id: String,
}

pub fn validate_rfid(tag: &RFIDTag) -> bool {
    tag.status == "ativo" && !tag.serial.is_empty()
}