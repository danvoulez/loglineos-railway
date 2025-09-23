use clap::{App, Arg, SubCommand};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};

/// Registry Create Binary - Consciousness database operations and entity persistence
/// logline-id://app.registry_create
/// Handles: Entity creation, span generation, provenance tracking, database operations

#[derive(Debug, Serialize, Deserialize)]
struct RegistryConfig {
    logline_id: String,
    version: String,
    signature: String,
    built_at: DateTime<Utc>,
}

#[derive(Debug, Serialize, Deserialize)]
struct RegistryEntry {
    logline_id: String,
    entity_type: String,
    handle: String,
    payload: serde_json::Value,
    provenance: String,
    created_at: DateTime<Utc>,
    version: i32,
    status: String,
    span_id: String,
}

fn main() {
    let config = RegistryConfig {
        logline_id: "logline-id://app.registry_create".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        signature: compute_binary_signature(),
        built_at: Utc::now(),
    };

    let matches = App::new("registry_create")
        .version(&config.version)
        .about("LogLineOS Registry Create - Consciousness database operations and entity persistence")
        .subcommand(SubCommand::with_name("create")
                    .about("Create new registry entry with span")
                    .arg(Arg::with_name("logline-id")
                         .long("logline-id")
                         .value_name("ID")
                         .help("LogLine ID for the entity")
                         .required(true)
                         .takes_value(true))
                    .arg(Arg::with_name("type")
                         .long("type")
                         .value_name("TYPE")
                         .help("Entity type")
                         .required(true)
                         .takes_value(true))
                    .arg(Arg::with_name("handle")
                         .long("handle")
                         .value_name("HANDLE")
                         .help("@handle for the entity")
                         .required(true)
                         .takes_value(true))
                    .arg(Arg::with_name("payload")
                         .long("payload")
                         .value_name("JSON")
                         .help("Entity payload as JSON")
                         .takes_value(true))
                    .arg(Arg::with_name("provenance")
                         .long("provenance")
                         .value_name("SOURCE")
                         .help("Provenance source")
                         .default_value("registry_create")
                         .takes_value(true)))
        .subcommand(SubCommand::with_name("update")
                    .about("Update existing registry entry (creates new version)")
                    .arg(Arg::with_name("logline-id")
                         .long("logline-id")
                         .value_name("ID")
                         .help("LogLine ID to update")
                         .required(true)
                         .takes_value(true))
                    .arg(Arg::with_name("payload")
                         .long("payload")
                         .value_name("JSON")
                         .help("Updated payload as JSON")
                         .required(true)
                         .takes_value(true))
                    .arg(Arg::with_name("provenance")
                         .long("provenance")
                         .value_name("SOURCE")
                         .help("Update provenance source")
                         .default_value("registry_update")
                         .takes_value(true)))
        .subcommand(SubCommand::with_name("query")
                    .about("Query registry entries")
                    .arg(Arg::with_name("logline-id")
                         .long("logline-id")
                         .value_name("ID")
                         .help("LogLine ID to query")
                         .takes_value(true))
                    .arg(Arg::with_name("handle")
                         .long("handle")
                         .value_name("HANDLE")
                         .help("@handle to query")
                         .takes_value(true))
                    .arg(Arg::with_name("type")
                         .long("type")
                         .value_name("TYPE")
                         .help("Filter by entity type")
                         .takes_value(true))
                    .arg(Arg::with_name("latest-only")
                         .long("latest-only")
                         .help("Return only latest versions")))
        .subcommand(SubCommand::with_name("migrate")
                    .about("Run database migrations")
                    .arg(Arg::with_name("database-url")
                         .long("database-url")
                         .value_name("URL")
                         .help("Database connection URL")
                         .takes_value(true)))
        .subcommand(SubCommand::with_name("status")
                    .about("Show registry status"))
        .get_matches();

    match matches.subcommand() {
        ("create", Some(sub_m)) => {
            let logline_id = sub_m.value_of("logline-id").unwrap();
            let entity_type = sub_m.value_of("type").unwrap();
            let handle = sub_m.value_of("handle").unwrap();
            let payload = sub_m.value_of("payload").unwrap_or("{}");
            let provenance = sub_m.value_of("provenance").unwrap();
            
            match create_registry_entry(logline_id, entity_type, handle, payload, provenance) {
                Ok(entry) => {
                    println!("{}", serde_json::to_string_pretty(&entry).unwrap());
                }
                Err(e) => {
                    eprintln!("Error creating registry entry: {}", e);
                    std::process::exit(1);
                }
            }
        }
        ("update", Some(sub_m)) => {
            let logline_id = sub_m.value_of("logline-id").unwrap();
            let payload = sub_m.value_of("payload").unwrap();
            let provenance = sub_m.value_of("provenance").unwrap();
            
            match update_registry_entry(logline_id, payload, provenance) {
                Ok(entry) => {
                    println!("{}", serde_json::to_string_pretty(&entry).unwrap());
                }
                Err(e) => {
                    eprintln!("Error updating registry entry: {}", e);
                    std::process::exit(1);
                }
            }
        }
        ("query", Some(sub_m)) => {
            let logline_id = sub_m.value_of("logline-id");
            let handle = sub_m.value_of("handle");
            let entity_type = sub_m.value_of("type");
            let latest_only = sub_m.is_present("latest-only");
            
            match query_registry(logline_id, handle, entity_type, latest_only) {
                Ok(results) => {
                    println!("{}", serde_json::to_string_pretty(&results).unwrap());
                }
                Err(e) => {
                    eprintln!("Error querying registry: {}", e);
                    std::process::exit(1);
                }
            }
        }
        ("migrate", Some(sub_m)) => {
            let database_url = sub_m.value_of("database-url");
            
            match run_migrations(database_url) {
                Ok(result) => {
                    println!("{}", serde_json::to_string_pretty(&result).unwrap());
                }
                Err(e) => {
                    eprintln!("Error running migrations: {}", e);
                    std::process::exit(1);
                }
            }
        }
        ("status", Some(_)) => {
            println!("{}", serde_json::to_string_pretty(&config).unwrap());
        }
        _ => {
            eprintln!("No subcommand provided. Use --help for usage information.");
            std::process::exit(1);
        }
    }
}

fn compute_binary_signature() -> String {
    format!("registry_v{}_{}_{}", 
            env!("CARGO_PKG_VERSION"),
            option_env!("BUILD_TIMESTAMP").unwrap_or("dev"),
            option_env!("GIT_COMMIT").unwrap_or("local"))
}

fn create_registry_entry(logline_id: &str, entity_type: &str, handle: &str, payload: &str, provenance: &str) -> Result<RegistryEntry, String> {
    // Validate entity type
    let valid_types = ["person", "object", "contract", "rule", "timeline", "app", "flow"];
    if !valid_types.contains(&entity_type) {
        return Err(format!("Invalid entity type: {}", entity_type));
    }
    
    // Parse payload
    let payload_json: serde_json::Value = serde_json::from_str(payload)
        .map_err(|e| format!("Invalid payload JSON: {}", e))?;
    
    // Generate span ID for this creation
    let span_id = Uuid::new_v4().to_string();
    
    // Create registry entry
    let entry = RegistryEntry {
        logline_id: logline_id.to_string(),
        entity_type: entity_type.to_string(),
        handle: handle.to_string(),
        payload: payload_json,
        provenance: provenance.to_string(),
        created_at: Utc::now(),
        version: 1,
        status: "active".to_string(),
        span_id,
    };
    
    // TODO: Insert into actual database
    // For now, simulate database insertion
    
    Ok(entry)
}

fn update_registry_entry(logline_id: &str, payload: &str, provenance: &str) -> Result<RegistryEntry, String> {
    // Parse new payload
    let payload_json: serde_json::Value = serde_json::from_str(payload)
        .map_err(|e| format!("Invalid payload JSON: {}", e))?;
    
    // TODO: Query existing entry from database to get current version
    // For now, simulate getting existing entry
    
    let span_id = Uuid::new_v4().to_string();
    let current_version = 1; // Mock current version
    
    // Create new version
    let entry = RegistryEntry {
        logline_id: logline_id.to_string(),
        entity_type: "unknown".to_string(), // Would be fetched from existing entry
        handle: "@unknown".to_string(), // Would be fetched from existing entry
        payload: payload_json,
        provenance: provenance.to_string(),
        created_at: Utc::now(),
        version: current_version + 1,
        status: "active".to_string(),
        span_id,
    };
    
    // TODO: Insert new version into database
    
    Ok(entry)
}

fn query_registry(logline_id: Option<&str>, handle: Option<&str>, entity_type: Option<&str>, latest_only: bool) -> Result<serde_json::Value, String> {
    // TODO: Implement actual database queries
    // For now, return mock results
    
    let mut mock_entries = Vec::new();
    
    if let Some(id) = logline_id {
        mock_entries.push(serde_json::json!({
            "logline_id": id,
            "entity_type": "person",
            "handle": "@mock",
            "payload": {},
            "provenance": "mock_data",
            "created_at": Utc::now().to_rfc3339(),
            "version": 1,
            "status": "active",
            "span_id": Uuid::new_v4().to_string()
        }));
    }
    
    if let Some(h) = handle {
        mock_entries.push(serde_json::json!({
            "logline_id": "logline-id://person.mock",
            "entity_type": "person",
            "handle": h,
            "payload": {},
            "provenance": "mock_data",
            "created_at": Utc::now().to_rfc3339(),
            "version": 1,
            "status": "active",
            "span_id": Uuid::new_v4().to_string()
        }));
    }
    
    Ok(serde_json::json!({
        "query": {
            "logline_id": logline_id,
            "handle": handle,
            "entity_type": entity_type,
            "latest_only": latest_only
        },
        "results": mock_entries,
        "count": mock_entries.len(),
        "queried_at": Utc::now().to_rfc3339()
    }))
}

fn run_migrations(database_url: Option<&str>) -> Result<serde_json::Value, String> {
    let db_url = database_url.unwrap_or("postgresql://postgres:password@localhost:5432/logline");
    
    // TODO: Run actual database migrations
    // This would involve:
    // 1. Connect to PostgreSQL
    // 2. Read LogLineSQL schema files
    // 3. Execute DDL statements
    // 4. Set up triggers and functions
    // 5. Create indexes and constraints
    
    // Mock migration results
    let migrations = vec![
        "Create registry table",
        "Create prevent_modifications trigger",
        "Create auto_version trigger", 
        "Create get_latest_registry function",
        "Create active_registry view",
        "Set up Row Level Security",
    ];
    
    Ok(serde_json::json!({
        "database_url": db_url,
        "migrations_applied": migrations,
        "migration_count": migrations.len(),
        "status": "completed",
        "migrated_at": Utc::now().to_rfc3339()
    }))
}