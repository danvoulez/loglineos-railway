# LogLine Motor Service

The Motor is the core execution engine of LogLineOS, responsible for:

- **Identity Management**: Creating and resolving LogLine IDs (@handles)
- **Ghost Mode**: Managing ephemeral identity sessions
- **Biometric Processing**: Face matching, fingerprint verification
- **RFID Integration**: Pairing RFID cards with identities
- **Digital Signatures**: Creating and verifying cryptographic signatures
- **Federation**: Syncing with other LogLine nodes

## API Endpoints

### Health
- `GET /health` - Service health check

### Identity Operations
- `POST /identity/create` - Create new LogLine ID
- `GET /identity/{handle}` - Resolve @handle to identity
- `POST /identity/ghost` - Create ghost session

### Biometric Operations
- `POST /biometria/verify` - Verify biometric data

### RFID Operations
- `POST /rfid/pair` - Pair RFID with identity

### Federation Operations
- `POST /federation/sync` - Sync with federation node

## Environment Variables

- `PORT` - Server port (default: 3001)

## Running

```bash
cargo run
```

Or with Docker:

```bash
docker build -t logline-motor .
docker run -p 3001:3001 logline-motor
```