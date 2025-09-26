-- Supabase migration for Smart Student Hub extended schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add extra fields to students
ALTER TABLE IF EXISTS students
  ADD COLUMN IF NOT EXISTS points integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS level integer DEFAULT 1;

-- Add verification fields to activities
ALTER TABLE IF EXISTS activities
  ADD COLUMN IF NOT EXISTS verification_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_flag_reason text DEFAULT NULL;

-- Gamification transactions
CREATE TABLE IF NOT EXISTS gamification_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  points integer NOT NULL,
  reason varchar(255),
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

-- Leaderboard cache
CREATE TABLE IF NOT EXISTS leaderboards (
  period varchar(32) NOT NULL,
  rank_json jsonb,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (period)
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  criteria text,
  issued_at timestamptz DEFAULT now(),
  vc_jwt text
);

-- AI verification jobs
CREATE TABLE IF NOT EXISTS ai_verification_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  status varchar(32) DEFAULT 'queued',
  result_json jsonb,
  created_at timestamptz DEFAULT now(),
  checked_at timestamptz
);

-- Quantum jobs (placeholder)
CREATE TABLE IF NOT EXISTS quantum_jobs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  params jsonb,
  result_json jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_students_points ON students(points DESC);

-- RPC for atomic increment (optional)
CREATE OR REPLACE FUNCTION increment_student_points(p_student_id uuid, p_points integer)
RETURNS void AS $$
BEGIN
  UPDATE students SET points = COALESCE(points,0) + p_points WHERE id = p_student_id;
END;
$$ LANGUAGE plpgsql;
