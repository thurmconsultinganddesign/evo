import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ProfileEditor } from './ProfileEditor';

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

  const params = await searchParams;
  const isOnboarding = params.onboarding === 'true';

  return (
    <ProfileEditor
      userId={user.id}
      profile={profile}
      isOnboarding={isOnboarding}
    />
  );
}
