-- Migration 002: Add notifications, activity types, and departments

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) UNIQUE NOT NULL,
  code varchar(10) UNIQUE,
  created_at timestamptz DEFAULT now()
);

-- Activity types table
CREATE TABLE IF NOT EXISTS activity_types (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name varchar(255) UNIQUE NOT NULL,
  description text,
  points_multiplier numeric DEFAULT 1.0,
  requires_evidence boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  title varchar(255) NOT NULL,
  message text,
  type varchar(50) DEFAULT 'info', -- info, success, warning, error
  read boolean DEFAULT false,
  data jsonb,
  created_at timestamptz DEFAULT now()
);

-- Ensure legacy notifications table uses the standard column naming
ALTER TABLE IF EXISTS notifications
  RENAME COLUMN user_id TO student_id;

-- xAPI statements for learning analytics
CREATE TABLE IF NOT EXISTS xapi_statements (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  activity_id uuid REFERENCES activities(id) ON DELETE CASCADE,
  statement jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Update students to reference department
ALTER TABLE students ADD COLUMN IF NOT EXISTS department_id uuid REFERENCES departments(id);

-- Update activities to reference activity_type
ALTER TABLE activities ADD COLUMN IF NOT EXISTS activity_type_id uuid REFERENCES activity_types(id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_student_id ON notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_xapi_statements_student_id ON xapi_statements(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_activity_type_id ON activities(activity_type_id);

-- Insert some default data only if the required columns exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'departments'
      AND column_name = 'code'
  ) THEN
    INSERT INTO departments (name, code) VALUES
      ('Computer Science', 'CS'),
      ('Information Technology', 'IT'),
      ('Electronics', 'EC'),
      ('Mechanical', 'ME')
    ON CONFLICT (name) DO NOTHING;
  ELSE
    INSERT INTO departments (name) VALUES
      ('Computer Science'),
      ('Information Technology'),
      ('Electronics'),
      ('Mechanical')
    ON CONFLICT (name) DO NOTHING;
  END IF;
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'activity_types'
      AND column_name = 'requires_evidence'
  ) THEN
    INSERT INTO activity_types (name, description, points_multiplier, requires_evidence) VALUES
      ('Hackathon Participation', 'Participating in coding hackathons', 2.0, true),
      ('Workshop Attendance', 'Attending technical workshops', 1.0, false),
      ('Project Submission', 'Submitting innovative projects', 3.0, true),
      ('Research Paper', 'Publishing research papers', 4.0, true),
      ('Sports Event', 'Participating in sports activities', 1.5, false),
      ('Cultural Event', 'Participating in cultural activities', 1.0, false)
    ON CONFLICT (name) DO NOTHING;
  ELSE
    INSERT INTO activity_types (name, description, points_multiplier) VALUES
      ('Hackathon Participation', 'Participating in coding hackathons', 2.0),
      ('Workshop Attendance', 'Attending technical workshops', 1.0),
      ('Project Submission', 'Submitting innovative projects', 3.0),
      ('Research Paper', 'Publishing research papers', 4.0),
      ('Sports Event', 'Participating in sports activities', 1.5),
      ('Cultural Event', 'Participating in cultural activities', 1.0)
    ON CONFLICT (name) DO NOTHING;
  END IF;
END;
$$;