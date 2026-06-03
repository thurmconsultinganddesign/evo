'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { PARTNER_CATEGORIES } from '@/types';
import type { RegenPartner, PartnerCategory } from '@/types';

type PartnerCard = Pick<
  RegenPartner,
  'id' | 'business_name' | 'short_description' | 'category' | 'photos'
>;

interface PartnersDirectoryProps {
  partners: PartnerCard[];
  isLoggedIn: boolean;
}

export function PartnersDirectory({
  partners,
  isLoggedIn,
}: PartnersDirectoryProps) {
  const [activeCategory, setActiveCategory] = useState<PartnerCategory | null>(
    null,
  );

  const filtered = activeCategory
    ? partners.filter((p) => p.category === activeCategory)
    : partners;

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
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-cream/60 hover:text-cream transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  href="/team"
                  className="text-sm text-cream/60 hover:text-cream transition-colors"
                >
                  Team
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm px-5 py-2 border border-gold/40 text-gold hover:bg-gold/10 rounded transition-all duration-200"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="px-6 py-16">
        <div className="mx-auto max-w-content">
          {/* Page heading */}
          <div className="mb-4">
            <Link
              href="/"
              className="text-sm text-cream/40 hover:text-cream/60 transition-colors"
            >
              &larr; Back to Home
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-4">
            <div>
              <p className="label-sm mb-4">Directory</p>
              <h1 className="font-serif text-display-sm text-cream">
                Regen Partners
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/partners/map"
                className="text-sm border border-white/10 rounded-sm px-4 py-2 text-cream/60 hover:text-cream hover:border-gold/30 transition-colors"
              >
                Map View
              </Link>
              {isLoggedIn && (
                <Link
                  href="/partners/new"
                  className="text-sm rounded-sm bg-gold px-4 py-2 font-medium text-dark hover:bg-gold-light transition-colors"
                >
                  + Add Partner
                </Link>
              )}
            </div>
          </div>
          <p className="text-sage mb-10 max-w-xl leading-relaxed">
            Regenerative businesses, communities, and projects in the network.
          </p>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-10">
            <button
              onClick={() => setActiveCategory(null)}
              className={cn(
                'text-sm rounded-sm px-4 py-2 border transition-colors',
                activeCategory === null
                  ? 'border-gold bg-gold/10 text-gold'
                  : 'border-white/10 text-cream/50 hover:text-cream hover:border-white/20',
              )}
            >
              All
            </button>
            {PARTNER_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() =>
                  setActiveCategory(activeCategory === cat ? null : cat)
                }
                className={cn(
                  'text-sm rounded-sm px-4 py-2 border transition-colors',
                  activeCategory === cat
                    ? 'border-gold bg-gold/10 text-gold'
                    : 'border-white/10 text-cream/50 hover:text-cream hover:border-white/20',
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Partners grid */}
          {filtered.length === 0 ? (
            <div className="border border-white/5 rounded-sm p-12 text-center">
              <p className="text-cream/40">
                {activeCategory
                  ? `No partners found in "${activeCategory}".`
                  : 'No partners listed yet.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((partner) => (
                <Link
                  key={partner.id}
                  href={`/partners/${partner.id}`}
                  className="group block border border-white/5 rounded-sm overflow-hidden hover:border-gold/20 transition-colors duration-300"
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] bg-dark-100">
                    {partner.photos && partner.photos.length > 0 ? (
                      <Image
                        src={partner.photos[0]}
                        alt={partner.business_name}
                        fill
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg
                          className="h-10 w-10 text-cream/10"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h2 className="text-cream font-medium group-hover:text-gold transition-colors">
                        {partner.business_name}
                      </h2>
                    </div>
                    <span className="inline-block text-xs rounded-sm border border-gold/20 bg-gold/5 px-2 py-0.5 text-gold mb-3">
                      {partner.category}
                    </span>
                    {partner.short_description && (
                      <p className="text-cream/40 text-sm line-clamp-2 leading-relaxed">
                        {partner.short_description}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
