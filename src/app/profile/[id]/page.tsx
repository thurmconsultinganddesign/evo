import Link from 'next/link';
import Image from 'next/image';
import { redirect, notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { cn } from '@/lib/utils';
import { Markdown } from '@/components/ui/Markdown';
import type { Profile } from '@/types';

export const dynamic = 'force-dynamic';

export default async function PublicProfilePage({
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

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*, teams(name)')
    .eq('id', id)
    .single();

  if (error || !profile) {
    notFound();
  }

  const typedProfile = profile as Profile & { teams: { name: string } | null };
  const teamName = typedProfile.teams?.name ?? null;
  const isOwner = user.id === typedProfile.id;

  // If profile is not visible and viewer is not the owner, show private message
  if (!typedProfile.is_visible && !isOwner) {
    return (
      <div className="min-h-screen bg-dark">
        <header className="border-b border-white/5 px-6 py-4">
          <div className="mx-auto max-w-content flex items-center justify-between">
            <Link
              href="/"
              className="font-serif text-xl text-cream tracking-wide"
            >
              evolove
            </Link>
            <Link
              href="/team"
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              &larr; Back to Team
            </Link>
          </div>
        </header>
        <main className="flex items-center justify-center px-6 py-32">
          <div className="text-center">
            <h1 className="font-serif text-heading text-cream mb-4">
              This profile is private.
            </h1>
            <p className="text-sage mb-8">
              This member has not made their profile visible to the team.
            </p>
            <Link
              href="/team"
              className="text-sm text-gold hover:text-gold-light transition-colors"
            >
              &larr; Return to Team Directory
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const fundamentals = [
    {
      label: 'Health',
      description:
        'Physical vitality, energy, nutrition, movement, sleep, and mental wellness.',
      score: typedProfile.health_score,
      reflection: typedProfile.health_reflection,
    },
    {
      label: 'Relationships',
      description:
        'Quality of connections — romantic, family, friendships, and community.',
      score: typedProfile.relationships_score,
      reflection: typedProfile.relationships_reflection,
    },
    {
      label: 'Career',
      description:
        'Professional fulfillment, financial alignment, impact, and creative expression.',
      score: typedProfile.career_score,
      reflection: typedProfile.career_reflection,
    },
  ];

  const socialLinks = typedProfile.social_links ?? {};
  const hasSocialLinks = Object.values(socialLinks).some(
    (v) => v && v.trim() !== '',
  );

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
              href="/team"
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              Team
            </Link>
            <Link
              href="/dashboard"
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/team"
              className="text-sm text-cream/40 hover:text-cream/60 transition-colors"
            >
              &larr; Back to Team Directory
            </Link>
          </div>

          {/* Profile header */}
          <div className="flex flex-col items-center text-center mb-12">
            <div className="relative h-32 w-32 overflow-hidden rounded-full bg-dark-100 mb-6">
              {typedProfile.avatar_url ? (
                <Image
                  src={typedProfile.avatar_url}
                  alt={typedProfile.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg
                    className="h-16 w-16 text-cream/20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1}
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
            <h1 className="font-serif text-display-sm text-cream mb-2">
              {typedProfile.full_name}
            </h1>
            {teamName && (
              <span className="inline-block text-xs rounded-sm border border-gold/20 bg-gold/5 px-3 py-1 text-gold">
                {teamName}
              </span>
            )}
            {isOwner && (
              <Link
                href="/profile"
                className="text-sm text-gold hover:text-gold-light transition-colors mt-2"
              >
                Edit Profile
              </Link>
            )}
          </div>

          {/* Bio */}
          {typedProfile.bio && (
            <section className="mb-12">
              <p className="label-sm mb-4">About</p>
              <Markdown className="text-cream/70">
                {typedProfile.bio}
              </Markdown>
            </section>
          )}

          {/* Purpose Statement */}
          {typedProfile.purpose_statement && (
            <section className="mb-12 border border-white/5 rounded-sm p-8">
              <p className="label-sm mb-4">Purpose</p>
              <Markdown className="text-cream/80 font-serif text-lg">
                {typedProfile.purpose_statement}
              </Markdown>
            </section>
          )}

          {/* Social Links & LinkedIn */}
          {(typedProfile.linkedin_url || hasSocialLinks) && (
            <section className="mb-12">
              <p className="label-sm mb-4">Connect</p>
              <div className="flex flex-wrap gap-3">
                {typedProfile.linkedin_url && (
                  <a
                    href={typedProfile.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-4 py-2 text-sm text-cream/60 hover:text-cream hover:border-gold/30 transition-colors"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                    LinkedIn
                  </a>
                )}
                {socialLinks.instagram && (
                  <a
                    href={socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-4 py-2 text-sm text-cream/60 hover:text-cream hover:border-gold/30 transition-colors"
                  >
                    Instagram
                  </a>
                )}
                {socialLinks.twitter && (
                  <a
                    href={socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-4 py-2 text-sm text-cream/60 hover:text-cream hover:border-gold/30 transition-colors"
                  >
                    Twitter / X
                  </a>
                )}
                {socialLinks.website && (
                  <a
                    href={socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-4 py-2 text-sm text-cream/60 hover:text-cream hover:border-gold/30 transition-colors"
                  >
                    Website
                  </a>
                )}
                {socialLinks.facebook && (
                  <a
                    href={socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-white/10 rounded-sm px-4 py-2 text-sm text-cream/60 hover:text-cream hover:border-gold/30 transition-colors"
                  >
                    Facebook
                  </a>
                )}
              </div>
            </section>
          )}

          {/* The Three Fundamentals — only show to the profile owner */}
          {isOwner && (
            <section className="mb-12">
              <h2 className="font-serif text-subheading text-cream mb-2">
                The Three Fundamentals
              </h2>
              <p className="text-sm text-sage leading-relaxed mb-8">
                Your personal reflections — only visible to you.
              </p>

              <div className="grid gap-6 sm:grid-cols-3">
                {fundamentals.map((f) => (
                  <FundamentalCard
                    key={f.label}
                    label={f.label}
                    description={f.description}
                    score={f.score}
                    reflection={f.reflection}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function FundamentalCard({
  label,
  description,
  score,
  reflection,
}: {
  label: string;
  description: string;
  score: number | null;
  reflection: string | null;
}) {
  const scoreColor =
    score === null
      ? 'text-cream/30'
      : score <= 3
        ? 'text-terracotta'
        : score <= 6
          ? 'text-gold'
          : 'text-forest-light';

  return (
    <div className="border border-white/5 rounded-sm p-6">
      <p className="label-sm mb-1">{label}</p>
      <p className="text-xs text-cream/30 leading-relaxed mb-4">
        {description}
      </p>
      <div
        className={cn(
          'font-serif text-4xl tabular-nums mb-4',
          scoreColor,
        )}
      >
        {score ?? '--'}
      </div>
      {reflection ? (
        <Markdown className="text-cream/50 text-sm">{reflection}</Markdown>
      ) : (
        <p className="text-cream/20 text-sm italic">No reflection yet.</p>
      )}
    </div>
  );
}
