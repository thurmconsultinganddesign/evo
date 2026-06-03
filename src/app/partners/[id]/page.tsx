import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { RegenPartner } from '@/types';

export default async function PartnerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: partner, error } = await supabase
    .from('regen_partners')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !partner) {
    notFound();
  }

  const p = partner as RegenPartner;

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
              href="/partners"
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              Partners
            </Link>
            <Link
              href="/partners/map"
              className="text-sm text-cream/60 hover:text-cream transition-colors"
            >
              Map
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          {/* Back link */}
          <div className="mb-8">
            <Link
              href="/partners"
              className="text-sm text-cream/40 hover:text-cream/60 transition-colors"
            >
              &larr; Back to Partners
            </Link>
          </div>

          {/* Photo gallery */}
          {p.photos && p.photos.length > 0 && (
            <div className="mb-10">
              {p.photos.length === 1 ? (
                <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-dark-100">
                  <Image
                    src={p.photos[0]}
                    alt={p.business_name}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-6 px-6 snap-x snap-mandatory scrollbar-hide">
                  {p.photos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative aspect-[4/3] w-80 shrink-0 overflow-hidden rounded-sm bg-dark-100 snap-start"
                    >
                      <Image
                        src={photo}
                        alt={`${p.business_name} photo ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Title and category */}
          <div className="mb-8">
            <span className="inline-block text-xs rounded-sm border border-gold/20 bg-gold/5 px-2 py-0.5 text-gold mb-4">
              {p.category}
            </span>
            <h1 className="font-serif text-display-sm text-cream mb-3">
              {p.business_name}
            </h1>
            {p.short_description && (
              <p className="text-sage text-lg leading-relaxed">
                {p.short_description}
              </p>
            )}
          </div>

          {/* Sustainability statement */}
          {p.sustainability_statement && (
            <section className="mb-10 border border-white/5 rounded-sm p-8">
              <p className="label-sm mb-4">How This Is Regenerative</p>
              <p className="text-cream/70 leading-relaxed whitespace-pre-line">
                {p.sustainability_statement}
              </p>
            </section>
          )}

          {/* Details grid */}
          <div className="grid gap-6 sm:grid-cols-2 mb-10">
            {/* Website */}
            {p.website_url && (
              <div className="border border-white/5 rounded-sm p-6">
                <p className="label-sm mb-3">Website</p>
                <a
                  href={p.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors text-sm break-all"
                >
                  {p.website_url.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {/* Offerings */}
            {p.offerings_url && (
              <div className="border border-white/5 rounded-sm p-6">
                <p className="label-sm mb-3">Offerings</p>
                <a
                  href={p.offerings_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold hover:text-gold-light transition-colors text-sm break-all"
                >
                  View brochure / pricing
                </a>
              </div>
            )}

            {/* Contact */}
            {p.contact_details && (
              <div className="border border-white/5 rounded-sm p-6">
                <p className="label-sm mb-3">Contact</p>
                <p className="text-cream/70 text-sm whitespace-pre-line">
                  {p.contact_details}
                </p>
              </div>
            )}

            {/* Google Maps */}
            {p.google_maps_url && (
              <div className="border border-white/5 rounded-sm p-6">
                <p className="label-sm mb-3">Location</p>
                <a
                  href={p.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-gold hover:text-gold-light transition-colors text-sm"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  View on Google Maps
                </a>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
