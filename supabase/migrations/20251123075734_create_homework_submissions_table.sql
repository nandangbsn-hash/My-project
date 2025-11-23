/*
  # Create homework_submissions table

  1. New Tables
    - `homework_submissions`
      - `id` (uuid, primary key)
      - `homework_id` (uuid, references homework_tasks)
      - `student_id` (uuid, references users)
      - `submitted_at` (timestamp)
      - `status` (text, enum: pending/submitted/graded)
      - `grade` (integer, 0-100)
      - `teacher_feedback` (text)
      - `submission_text` (text)
      - `submission_url` (text)

  2. Security
    - Enable RLS
    - Students can create/update own submissions
    - Teachers can view and grade submissions
*/

CREATE TABLE IF NOT EXISTS homework_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  homework_id uuid NOT NULL REFERENCES homework_tasks(id) ON DELETE CASCADE,
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  submitted_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
  grade integer CHECK (grade >= 0 AND grade <= 100),
  teacher_feedback text,
  submission_text text,
  submission_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create own submissions"
  ON homework_submissions FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can update own submissions"
  ON homework_submissions FOR UPDATE
  TO authenticated
  USING (student_id = auth.uid())
  WITH CHECK (student_id = auth.uid() AND status != 'graded');

CREATE POLICY "Students can view own submissions"
  ON homework_submissions FOR SELECT
  TO authenticated
  USING (student_id = auth.uid());

CREATE POLICY "Teachers can view all submissions"
  ON homework_submissions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM homework_tasks
      WHERE homework_tasks.id = homework_submissions.homework_id
      AND homework_tasks.teacher_id = auth.uid()
    )
  );

CREATE POLICY "Teachers can grade submissions"
  ON homework_submissions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM homework_tasks
      WHERE homework_tasks.id = homework_submissions.homework_id
      AND homework_tasks.teacher_id = auth.uid()
    )
  );

CREATE INDEX homework_submissions_student_id ON homework_submissions(student_id);
CREATE INDEX homework_submissions_homework_id ON homework_submissions(homework_id);
