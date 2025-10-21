#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    set -a
    source .env
    set +a
else
    echo "Error: .env file not found"
    exit 1
fi

echo "Creating documents table in database [${DB_COLLECTION}]..."

# Execute the SQL file
docker exec -i chatrag-db psql -U "${DB_USERNAME}" -d "${DB_COLLECTION}" < create-tables.sql

if [ $? -eq 0 ]; then
    echo "Table created successfully!"
else
    echo "Error creating table"
    exit 1
fi