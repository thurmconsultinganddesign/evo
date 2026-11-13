-- Add new green-lit emails to the invite-only allow-list
-- Idempotent: re-running is safe (duplicates are skipped via the email UNIQUE constraint)

INSERT INTO public.allowed_emails (email)
VALUES
  ('matteo@sejiva.id'),
  ('juliusbramanto@gmail.com')
ON CONFLICT (email) DO NOTHING;
