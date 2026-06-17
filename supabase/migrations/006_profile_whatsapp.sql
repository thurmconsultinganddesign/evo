-- ============================================================
-- EVO — WhatsApp contact on profiles
-- ============================================================
-- Adds an optional WhatsApp number to a member's profile so other
-- members can message them directly.
--
-- Visibility model: this is just another column on `profiles`, so it
-- is covered by the existing profiles RLS — readable by authenticated
-- members on profiles that are visible (or their own). There is no
-- separate opt-in toggle: leaving the field blank is the opt-out.
-- Store in international format, e.g. "+62 812 3456 7890".
-- ------------------------------------------------------------

alter table public.profiles
  add column whatsapp text;
