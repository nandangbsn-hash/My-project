/*
  # Create doubt_questions table

  1. New Tables
    - `doubt_questions`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references users)
      - `question_text` (text)
      - `question_image_url` (text)
      - `ai_answer` (text)
      - `reference_links` (jsonb)
      - `chapter_tag` (text)
      - `subject` (text)
      - `teacher_reviewed` (boolean)
      - `teacher_feedback` (text)
      - `is_anonymous` (boolean)
      - `quality_rating` (integer, 1-5)
      - `posted_at` (timestamp)

  2. Security
    - Enable RLS
    - Students can create questions
    - Students can view their own questions
    - Teachers can view all questions and provide feedback
*/

CREATE TABLE IF NOT EXISTS doubt_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_image_url text,
  ai_answer text,
  reference_links jsonb DEFAULT '[]'::jsonb,
  chapter_tag text,
  subject text,
  teacher_reviewed boolean DEFAULT false,
  teacher_feedback text,
  is_anonymous boolean DEFAULT false,
  quality_rating integer CHECK (quality_rating >= 1 AND quality_rating <= 5),
  posted_at timestamptz DEFAULT now()
);

ALTER TABLE doubt_questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can create own questions"
  ON doubt_questions FOR INSERT
  TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students can view own questions"
  ON doubt_questions FOR SELECT
  TO authenticated
  USING (student_id = auth.uid() OR is_anonymous = false);

CREATE POLICY "Teachers can view all questions"
  ON doubt_questions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'teacher'
    )
  );

CREATE POLICY "Teachers can update questions"
  ON doubt_questions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'teacher'
    )
  );

CREATE INDEX doubt_questions_student_id ON doubt_questions(student_id);
CREATE INDEX doubt_questions_subject ON doubt_questions(subject);
CREATE INDEX doubt_questions_posted_at ON doubt_questions(posted_at);
