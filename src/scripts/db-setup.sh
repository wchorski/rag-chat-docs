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

# Verify variables are loaded
echo "Connecting to database [$DB_COLLECTION] as user [$DB_USERNAME]"

# Execute the SQL file
docker exec -i chatrag-db psql -U "$DB_USERNAME" -d "$DB_COLLECTION" < setup.sql

if [ $? -eq 0 ]; then
    echo "SQL commands executed successfully!"
else
    echo "Error executing SQL commands"
    exit 1
fi