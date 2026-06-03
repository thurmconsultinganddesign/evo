import Link from 'next/link';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, full_name, avatar_url, bio, purpose_statement')
    .eq('is_visible', true)
    .order('full_name');

  const visibleProfiles = (profiles ?? []) as Pick<
    Profile,
    'id' | 'full_name' | 'avatar_url' | 'bio' | 'purpose_statement'
  >[];

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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProfiles.map((profile) => (
                <Link
                  key={profile.id}
                  href={`/profile/${profile.id}`}
                  className="group block border border-white/5 rounded-sm p-6 hover:border-gold/20 transition-colors duration-300"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-dark-100">
                      {profile.avatar_url ? (
                        <Image
                          src={profile.avatar_url}
                          alt={profile.full_name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <svg
                            className="h-6 w-6 text-cream/20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-cream font-medium truncate group-hover:text-gold transition-colors">
                        {profile.full_name}
                      </h2>
                      {profile.bio && (
                        <p className="text-cream/40 text-sm mt-1 line-clamp-2 leading-relaxed">
                          {profile.bio}
                        </p>
                      )}
                    </div>
                  </div>
                  {profile.purpose_statement && (
                    <div className="border-t border-white/5 pt-4">
                      <p className="label-sm mb-2">Purpose</p>
                      <p className="text-cream/50 text-sm line-clamp-3 leading-relaxed">
                        {profile.purpose_statement}
                      </p>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
