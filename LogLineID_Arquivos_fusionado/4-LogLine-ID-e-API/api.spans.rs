//! Retorna todos os spans públicos de um LogLineID.

use crate::timeline::Span;

pub fn get_public_spans(internal_id: &str, spans: &dyn SpanQuery) -> Vec<Span> {
    spans.find_spans_by_identity(internal_id)
}