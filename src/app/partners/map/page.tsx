import { createServerSupabaseClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { PartnerMap } from './PartnerMap';
import type { RegenPartner } from '@/types';

export default async function MapPage() {
  const supabase = await createServerSupabaseClient();

  const { data: partners } = await supabase
    .from('regen_partners')
    .select('*')
    .not('latitude', 'is', null)
    .not('longitude', 'is', null)
    .order('business_name');

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto max-w-content flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-cream tracking-wide">
            evolove
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/partners" className="text-sm text-cream/60 hover:text-cream transition-colors">
              Directory
            </Link>
            <Link href="/partners/map" className="text-sm text-cream transition-colors">
              Map
            </Link>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <div className="mx-auto max-w-content">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="label-sm mb-2">Regen Partners</p>
              <h1 className="font-serif text-heading text-cream">Ubud Map</h1>
            </div>
            <Link
              href="/partners"
              className="text-sm text-cream/40 hover:text-cream/60 transition-colors"
            >
              &larr; Back to Directory
            </Link>
          </div>

          <PartnerMap partners={(partners as RegenPartner[]) || []} />
        </div>
      </main>
    </div>
  );
}
