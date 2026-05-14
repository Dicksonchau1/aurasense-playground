-- Add session_summary column to sessions table if not present
ALTER TABLE sessions
ADD COLUMN IF NOT EXISTS session_summary jsonb;
