#!/bin/bash

# LogLine SQL Bundle Creator
# Creates a complete .tar.gz package with PostgreSQL schema and examples

echo "🧠 Creating LogLine SQL Bundle..."

# Create bundle directory
BUNDLE_DIR="logline-sql-bundle-$(date +%Y%m%d)"
mkdir -p "$BUNDLE_DIR"

# Copy all LogLineSQL contents
cp -r LogLineSQL/* "$BUNDLE_DIR/"

# Create install script
cat > "$BUNDLE_DIR/install.sh" << 'EOF'
#!/bin/bash

echo "🚀 Installing LogLine SQL Schema..."

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL client (psql) not found. Please install PostgreSQL first."
    exit 1
fi

# Database connection variables
DB_NAME="${DB_NAME:-logline}"
DB_USER="${DB_USER:-postgres}"
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"

echo "📋 Database Configuration:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Host: $DB_HOST"
echo "  Port: $DB_PORT"

# Create database if it doesn't exist
echo "🗃️ Creating database if needed..."
createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME" 2>/dev/null || true

# Install schema
echo "🏗️ Installing LogLine SQL schema..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f schema.sql

if [ $? -eq 0 ]; then
    echo "✅ LogLine SQL schema installed successfully!"
    echo ""
    echo "🧪 To test, run some example queries:"
    echo "  psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f examples/queries.sql"
    echo ""
    echo "📚 See README.md for full documentation"
else
    echo "❌ Error installing schema. Check your database connection."
    exit 1
fi
EOF

chmod +x "$BUNDLE_DIR/install.sh"

# Create README for the bundle
cat > "$BUNDLE_DIR/BUNDLE_README.md" << 'EOF'
# LogLine SQL Bundle

This bundle contains everything needed to set up a LogLine-compatible PostgreSQL database.

## 📦 Contents

- `schema.sql` - Complete PostgreSQL schema with append-only tables
- `README.md` - Full documentation and usage guide  
- `examples/queries.sql` - Example SQL queries and usage patterns
- `registry_store/` - File storage structure for related documents
- `spans/` - Example spans for timeline integration
- `install.sh` - Automated installation script

## 🚀 Quick Install

```bash
# Set your database connection (optional)
export DB_NAME=logline
export DB_USER=postgres
export DB_HOST=localhost

# Run installer
./install.sh
```

## 🧠 What You Get

- **Append-only registry table** - Immutable, versioned records
- **LogLine ID support** - Universal identity system
- **JSONB payload storage** - Flexible, queryable data
- **Automatic versioning** - Version increment triggers
- **Provenance tracking** - Full audit trail
- **File references** - Link to external documents
- **Execution tracking** - Span and replay support

## 🔗 Integration

This database schema integrates with:
- LogLine Motor (Rust components)
- LogLine API (FastAPI/Node.js)
- LogLine Timeline (event tracking)
- LogLine UI (Neon components)

## 📞 Support

For questions about LogLine SQL:
- Read the full README.md
- Check examples/queries.sql
- See LogLineOS documentation

---
*LogLine SQL: Where every record is a consciousness*
EOF

# Create the bundle
echo "📦 Creating bundle archive..."
tar -czf "${BUNDLE_DIR}.tar.gz" "$BUNDLE_DIR"

echo "✅ LogLine SQL Bundle created: ${BUNDLE_DIR}.tar.gz"
echo ""
echo "📋 Bundle contains:"
echo "  - PostgreSQL schema with append-only registry"
echo "  - Complete documentation and examples"
echo "  - Automated installer script" 
echo "  - File storage structure"
echo "  - Example data and spans"
echo ""
echo "🚀 To use:"
echo "  1. Extract: tar -xzf ${BUNDLE_DIR}.tar.gz"
echo "  2. Install: cd ${BUNDLE_DIR} && ./install.sh"
echo "  3. Test: psql -d logline -f examples/queries.sql"

# Cleanup
rm -rf "$BUNDLE_DIR"