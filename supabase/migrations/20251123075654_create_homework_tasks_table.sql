/*
  # Create homework_tasks table

  1. New Tables
    - `homework_tasks`
      - `id` (uuid, primary key)
      - `teacher_id` (uuid, references users)
      - `title` (text)
      - `subject` (text)
      - `description` (text)
      - `attachments` (jsonb, array of file objects)
      - `deadline` (timestamptz)
      - `category` (text, enum: homework/test/announcement/event)
      - `priority` (text, enum: low/medium/high)
      - `ai_summary` (text)
      - `posted_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS
    - Teachers can create/update/delete their own homework
    - Students can view homework for their class
*/

CREATE TABLE IF NOT EXISTS homework_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  subject text NOT NULL,
  description text,
  attachments jsonb DEFAULT '[]'::jsonb,
  deadline timestamptz NOT NULL,
  category text NOT NULL DEFAULT 'homework' CHECK (category IN ('homework', 'test', 'announcement', 'event')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  ai_summary text,
  posted_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE homework_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can create own homework"
  ON homework_tasks FOR INSERT
  TO authenticated
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can update own homework"
  ON homework_tasks FOR UPDATE
  TO authenticated
  USING (teacher_id = auth.uid())
  WITH CHECK (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete own homework"
  ON homework_tasks FOR DELETE
  TO authenticated
  USING (teacher_id = auth.uid());

CREATE POLICY "Users can view homework"
  ON homework_tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE INDEX homework_tasks_teacher_id ON homework_tasks(teacher_id);
CREATE INDEX homework_tasks_deadline ON homework_tasks(deadline);
