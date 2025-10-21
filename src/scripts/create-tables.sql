-- Drop existing table if you want to start fresh
-- DROP TABLE IF EXISTS documents;

CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    file_id TEXT UNIQUE NOT NULL,  -- Unique identifier for the file (relative path)
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    embedding VECTOR(384),
    file_path TEXT,  -- Full path to the source file
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on file_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_documents_file_id ON documents(file_id);

-- Verify the table structure
\d documents