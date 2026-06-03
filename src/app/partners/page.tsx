import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { RegenPartner } from '@/types';
import { PartnersDirectory } from './PartnersDirectory';

export default async function PartnersPage() {
  const supabase = await createServerSupabaseClient();

  // Check auth status (for showing/hiding "Add Partner" link)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: partners } = await supabase
    .from('regen_partners')
    .select('id, business_name, short_description, category, photos')
    .order('business_name');

  return (
    <PartnersDirectory
      partners={(partners ?? []) as Pick<
        RegenPartner,
        'id' | 'business_name' | 'short_description' | 'category' | 'photos'
      >[]}
      isLoggedIn={!!user}
    />
  );
}
