/*
  # Create class_notes table

  1. New Tables
    - `class_notes`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, references users)
      - `subject` (text)
      - `chapter` (text)
      - `notes_url` (text)
      - `notes_text` (text)
      - `keywords` (jsonb, array of strings)
      - `uploaded_at` (timestamp)

  2. Security
    - Enable RLS
    - Teachers can create/update their own notes
    - Students can view notes
*/

CREATE TABLE IF NOT EXISTS class_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  chapter text,
  notes_url text,
  notes_text text,
  keywords jsonb DEFAULT '[]'::jsonb,
  uploaded_at timestamptz DEFAULT now()
);

ALTER TABLE class_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create own notes"
  ON class_notes FOR INSERT
  TO authenticated
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own notes"
  ON class_notes FOR UPDATE
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Users can view notes"
  ON class_notes FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX class_notes_teacher_id ON class_notes(teacher_id);
CREATE INDEX class_notes_subject ON class_notes(subject);
