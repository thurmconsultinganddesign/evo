import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProfileEditor } from './ProfileEditor';
import type { Team } from '@/types';

export const dynamic = 'force-dynamic';

export default async function ProfilePage({
  searchParams,
}: {
  searchParams: Promise<{ onboarding?: string }>;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const { data: teams } = await supabase
    .from('teams')
    .select('id, name, sort_order, created_at')
    .order('sort_order');

  const params = await searchParams;
  const isOnboarding = params.onboarding === 'true';

  return (
    <ProfileEditor
      userId={user.id}
      profile={profile}
      teams={(teams ?? []) as Team[]}
      isOnboarding={isOnboarding}
    />
  );
}
