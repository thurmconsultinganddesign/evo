-- Add new green-lit emails to the invite-only allow-list
-- Idempotent: re-running is safe (duplicates are skipped via the email UNIQUE constraint)

INSERT INTO public.allowed_emails (email)
VALUES
  ('tomo@earthcompany.info'),
  ('mendi@eco-mantra.com'),
  ('alex.lee.edleson@gmail.com'),
  ('deandre@earthcompany.info'),
  ('stephen@network-economies.com'),
  ('umaapudakwangi@gmail.com')
ON CONFLICT (email) DO NOTHING;
