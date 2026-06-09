import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { TeamDirectory, type TeamMember } from './TeamDirectory';
import type { Team } from '@/types';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [{ data: profiles }, { data: teams }] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, full_name, avatar_url, bio, purpose_statement, team_id')
      .eq('is_visible', true)
      .order('full_name'),
    supabase
      .from('teams')
      .select('id, name, sort_order, created_at')
      .order('sort_order'),
  ]);

  const visibleProfiles = (profiles ?? []) as TeamMember[];
  const teamList = (teams ?? []) as Team[];

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto max-w-content flex items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl text-cream tracking-wide"
          >
            evolove
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/partners"
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              Partners
            </Link>
            <Link
              href="/profile"
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              My Profile
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-16">
        <div className="mx-auto max-w-content">
          {/* Page heading */}
          <div className="mb-4">
            <Link
              href="/dashboard"
              className="text-sm text-cream/40 hover:text-cream/60 transition-colors"
            >
              &larr; Back to Dashboard
            </Link>
          </div>
          <p className="label-sm mb-4">Community</p>
          <h1 className="font-serif text-display-sm text-cream mb-4">
            Team Directory
          </h1>
          <p className="text-sage mb-12 max-w-xl leading-relaxed">
            Members who have made their profiles visible to the community.
          </p>

          {visibleProfiles.length === 0 ? (
            <div className="border border-white/5 rounded-sm p-12 text-center">
              <p className="text-cream/40">
                No visible profiles yet. Be the first to{' '}
                <Link href="/profile" className="text-gold hover:text-gold-light transition-colors">
                  make your profile visible
                </Link>
                .
              </p>
            </div>
          ) : (
            <TeamDirectory profiles={visibleProfiles} teams={teamList} />
          )}
        </div>
      </main>
    </div>
  );
}
