-- Migration to add student tags for gamification
CREATE TABLE IF NOT EXISTS student_tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id uuid REFERENCES students(id) ON DELETE CASCADE,
  tag varchar(50) NOT NULL,
  assigned_at timestamptz DEFAULT now(),
  UNIQUE(student_id, tag)
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_student_tags_student_id ON student_tags(student_id);
CREATE INDEX IF NOT EXISTS idx_student_tags_tag ON student_tags(tag);