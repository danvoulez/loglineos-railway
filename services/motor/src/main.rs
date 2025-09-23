use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use tokio::net::TcpListener;
use tracing::{info, warn};
use warp::Filter;

mod biometria;
mod federation;
mod ghost;
mod identity_state;
mod logline_id;
mod resolver;
mod rfid;
mod signature;

pub use biometria::*;
pub use federation::*;
pub use ghost::*;
pub use identity_state::*;
pub use logline_id::*;
pub use resolver::*;
pub use rfid::*;
pub use signature::*;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MotorState {
    pub active_sessions: HashMap<String, GhostSession>,
    pub identity_cache: HashMap<String, LogLineIdentity>,
    pub federation_nodes: Vec<FederationNode>,
}

impl Default for MotorState {
    fn default() -> Self {
        Self {
            active_sessions: HashMap::new(),
            identity_cache: HashMap::new(),
            federation_nodes: Vec::new(),
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct HealthResponse {
    status: String,
    version: String,
    uptime: u64,
}

#[tokio::main]
async fn main() -> Result<()> {
    tracing_subscriber::init();

    let motor_state = std::sync::Arc::new(tokio::sync::RwLock::new(MotorState::default()));
    let start_time = std::time::Instant::now();

    info!("🚀 LogLine Motor starting...");

    // Health check endpoint
    let health = warp::path("health")
        .and(warp::get())
        .map(move || {
            let uptime = start_time.elapsed().as_secs();
            warp::reply::json(&HealthResponse {
                status: "healthy".to_string(),
                version: env!("CARGO_PKG_VERSION").to_string(),
                uptime,
            })
        });

    // Identity operations endpoints
    let state_for_identity = motor_state.clone();
    let identity_routes = warp::path("identity")
        .and(
            // POST /identity/create - Create new LogLine ID
            warp::path("create")
                .and(warp::post())
                .and(warp::body::json())
                .and(with_state(state_for_identity.clone()))
                .and_then(create_identity)
                .or(
                    // GET /identity/{id} - Resolve LogLine ID
                    warp::path::param::<String>()
                        .and(warp::get())
                        .and(with_state(state_for_identity.clone()))
                        .and_then(resolve_identity)
                )
                .or(
                    // POST /identity/ghost - Create ghost session
                    warp::path("ghost")
                        .and(warp::post())
                        .and(warp::body::json())
                        .and(with_state(state_for_identity.clone()))
                        .and_then(create_ghost_session)
                )
        );

    // Biometria endpoints
    let state_for_bio = motor_state.clone();
    let biometria_routes = warp::path("biometria")
        .and(
            warp::path("verify")
                .and(warp::post())
                .and(warp::body::json())
                .and(with_state(state_for_bio))
                .and_then(verify_biometria)
        );

    // RFID endpoints
    let state_for_rfid = motor_state.clone();
    let rfid_routes = warp::path("rfid")
        .and(
            warp::path("pair")
                .and(warp::post())
                .and(warp::body::json())
                .and(with_state(state_for_rfid))
                .and_then(pair_rfid)
        );

    // Federation endpoints
    let state_for_fed = motor_state.clone();
    let federation_routes = warp::path("federation")
        .and(
            warp::path("sync")
                .and(warp::post())
                .and(warp::body::json())
                .and(with_state(state_for_fed))
                .and_then(sync_federation)
        );

    let routes = health
        .or(identity_routes)
        .or(biometria_routes)
        .or(rfid_routes)
        .or(federation_routes)
        .with(warp::cors().allow_any_origin());

    let port = std::env::var("PORT")
        .unwrap_or_else(|_| "3001".to_string())
        .parse::<u16>()
        .unwrap_or(3001);

    info!("🔧 LogLine Motor listening on port {}", port);

    warp::serve(routes)
        .run(([0, 0, 0, 0], port))
        .await;

    Ok(())
}

fn with_state(
    state: std::sync::Arc<tokio::sync::RwLock<MotorState>>,
) -> impl Filter<Extract = (std::sync::Arc<tokio::sync::RwLock<MotorState>>,), Error = std::convert::Infallible> + Clone {
    warp::any().map(move || state.clone())
}

async fn create_identity(
    request: CreateIdentityRequest,
    state: std::sync::Arc<tokio::sync::RwLock<MotorState>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    info!("Creating identity for @{}", request.handle);
    
    let identity = LogLineIdentity::new(request.handle.clone(), request.entity_type, request.metadata);
    
    {
        let mut state_lock = state.write().await;
        state_lock.identity_cache.insert(request.handle, identity.clone());
    }
    
    Ok(warp::reply::json(&identity))
}

async fn resolve_identity(
    handle: String,
    state: std::sync::Arc<tokio::sync::RwLock<MotorState>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    info!("Resolving identity for @{}", handle);
    
    let state_lock = state.read().await;
    
    if let Some(identity) = state_lock.identity_cache.get(&handle) {
        Ok(warp::reply::json(identity))
    } else {
        Ok(warp::reply::with_status(
            warp::reply::json(&serde_json::json!({"error": "Identity not found"})),
            warp::http::StatusCode::NOT_FOUND
        ))
    }
}

async fn create_ghost_session(
    request: CreateGhostRequest,
    state: std::sync::Arc<tokio::sync::RwLock<MotorState>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    info!("Creating ghost session");
    
    let session = GhostSession::new(request.device_id, request.metadata);
    let session_id = session.id.clone();
    
    {
        let mut state_lock = state.write().await;
        state_lock.active_sessions.insert(session_id.clone(), session.clone());
    }
    
    Ok(warp::reply::json(&session))
}

async fn verify_biometria(
    request: BiometriaRequest,
    state: std::sync::Arc<tokio::sync::RwLock<MotorState>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    info!("Verifying biometria for session {}", request.session_id);
    
    let result = process_biometria_verification(request).await;
    
    Ok(warp::reply::json(&result))
}

async fn pair_rfid(
    request: RfidPairRequest,
    state: std::sync::Arc<tokio::sync::RwLock<MotorState>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    info!("Pairing RFID {} with identity {}", request.rfid_id, request.identity_id);
    
    let result = pair_rfid_with_identity(request).await;
    
    Ok(warp::reply::json(&result))
}

async fn sync_federation(
    request: FederationSyncRequest,
    state: std::sync::Arc<tokio::sync::RwLock<MotorState>>,
) -> Result<impl warp::Reply, warp::Rejection> {
    info!("Syncing federation with node {}", request.node_id);
    
    let result = sync_with_federation_node(request).await;
    
    Ok(warp::reply::json(&result))
}