import { redirect, notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { EditPartnerForm } from './EditPartnerForm';
import type { RegenPartner } from '@/types';

export const dynamic = 'force-dynamic';

export default async function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: partner, error } = await supabase
    .from('regen_partners')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !partner) {
    notFound();
  }

  return <EditPartnerForm partner={partner as RegenPartner} />;
}
