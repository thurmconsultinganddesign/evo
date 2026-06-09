'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import type { Profile, Team } from '@/types';

export type TeamMember = Pick<
  Profile,
  'id' | 'full_name' | 'avatar_url' | 'bio' | 'purpose_statement' | 'team_id'
>;

interface TeamDirectoryProps {
  profiles: TeamMember[];
  teams: Team[];
}

export function TeamDirectory({ profiles, teams }: TeamDirectoryProps) {
  const [activeTeam, setActiveTeam] = useState<string | null>(null);

  // Only show filter pills for teams that actually have visible members.
  const teamsWithMembers = teams.filter((team) =>
    profiles.some((p) => p.team_id === team.id),
  );

  const filtered = activeTeam
    ? profiles.filter((p) => p.team_id === activeTeam)
    : profiles;

  const teamName = (id: string | null) =>
    teams.find((t) => t.id === id)?.name ?? null;

  return (
    <>
      {/* Team filters */}
      {teamsWithMembers.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveTeam(null)}
            className={cn(
              'text-sm rounded-sm px-4 py-2 border transition-colors',
              activeTeam === null
                ? 'border-gold bg-gold/10 text-gold'
                : 'border-white/10 text-cream/50 hover:text-cream hover:border-white/20',
            )}
          >
            All
          </button>
          {teamsWithMembers.map((team) => (
            <button
              key={team.id}
              onClick={() =>
                setActiveTeam(activeTeam === team.id ? null : team.id)
              }
              className={cn(
                'text-sm rounded-sm px-4 py-2 border transition-colors',
                activeTeam === team.id
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/10 text-cream/50 hover:text-cream hover:border-white/20',
              )}
            >
              {team.name}
            </button>
          ))}
        </div>
      )}

      {/* Members grid */}
      {filtered.length === 0 ? (
        <div className="border border-white/5 rounded-sm p-12 text-center">
          <p className="text-cream/40">
            {activeTeam
              ? 'No visible members in this team yet.'
              : 'No visible profiles yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((profile) => (
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
                  {teamName(profile.team_id) && (
                    <p className="text-gold/70 text-xs mt-0.5 truncate">
                      {teamName(profile.team_id)}
                    </p>
                  )}
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
    </>
  );
}
