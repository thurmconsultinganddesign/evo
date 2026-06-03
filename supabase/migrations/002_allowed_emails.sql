-- Allowed emails for invite-only access
CREATE TABLE public.allowed_emails (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  added_at timestamptz NOT NULL DEFAULT now()
);

-- Allow anyone to check if an email is allowed (needed for login page check)
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can check allowed emails"
  ON public.allowed_emails
  FOR SELECT
  TO anon, authenticated
  USING (true);
