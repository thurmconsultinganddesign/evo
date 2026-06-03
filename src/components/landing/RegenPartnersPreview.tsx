import Link from 'next/link';

export function RegenPartnersPreview() {
  return (
    <section id="partners" className="section-cream section-padding">
      <div className="section-container">
        <p className="label-sm text-gold/80 mb-4">Regenerative Directory</p>

        <h2 className="font-serif text-heading md:text-display-sm text-dark max-w-3xl mb-6">
          Regen Partners
        </h2>

        <p className="text-dark/70 max-w-2xl mb-12 leading-relaxed">
          A curated directory of regenerative businesses, services, and experiences
          in and around Ubud. From eco-villages and organic restaurants to wellness
          practitioners and educational programs — discover the people and places
          building a better world.
        </p>

        {/* Category previews */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            'Eco Village',
            'Hub',
            'Restaurant',
            'Service',
            'Educational',
            'Eco Resort',
            'Product',
            'Events',
          ].map((category) => (
            <div
              key={category}
              className="bg-dark/5 rounded-sm p-4 text-center hover:bg-dark/10 transition-colors"
            >
              <p className="text-dark/70 text-sm">{category}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/partners"
            className="inline-block px-8 py-3.5 bg-dark text-cream text-sm uppercase tracking-[0.15em] hover:bg-dark-100 transition-all duration-300 text-center"
          >
            Browse Directory
          </Link>
          <Link
            href="/partners/map"
            className="inline-block px-8 py-3.5 border border-dark/20 text-dark text-sm uppercase tracking-[0.15em] hover:bg-dark/5 transition-all duration-300 text-center"
          >
            View Map
          </Link>
        </div>
      </div>
    </section>
  );
}
