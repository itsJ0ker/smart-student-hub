-- Base schema for Smart Student Hub
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) NOT NULL,
  roll_no varchar(50) UNIQUE,
  department varchar(100),
  email varchar(255) UNIQUE,
  points integer DEFAULT 0,
  level integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  activity_type varchar(50) NOT NULL,
  status varchar(20) DEFAULT 'pending', -- pending, approved, rejected
  hours integer,
  evidence_url text,
  provider varchar(255),
  faculty_approver uuid,
  approved_at timestamptz,
  verification_score numeric DEFAULT 0,
  ai_flag_reason text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  name varchar(255) NOT NULL,
  criteria text,
  vc_jwt text,
  created_at timestamptz DEFAULT now()
);

-- Leaderboards table
CREATE TABLE IF NOT EXISTS leaderboards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  period varchar(50) UNIQUE,
  rank_json jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Gamification transactions table
CREATE TABLE IF NOT EXISTS gamification_transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  points integer NOT NULL,
  reason varchar(255),
  meta jsonb,
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activities_student_id ON activities(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_badges_student_id ON badges(student_id);
CREATE INDEX IF NOT EXISTS idx_gamification_transactions_student_id ON gamification_transactions(student_id);