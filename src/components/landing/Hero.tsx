export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center section-dark section-padding pt-32">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark" />

      <div className="relative section-container text-center">
        <p className="label-sm mb-6">
          The sacred context of the great awakening
        </p>

        <h1 className="font-serif text-display-sm md:text-display text-cream max-w-4xl mx-auto mb-8">
          From Fragmentation{' '}
          <span className="block">to Coherence.</span>
        </h1>

        <p className="text-lg md:text-xl text-cream/60 max-w-2xl mx-auto mb-4 leading-relaxed">
          Evolove is the synthesis of conscious development and deep care.
        </p>
        <p className="text-base md:text-lg text-cream/40 max-w-xl mx-auto">
          Building the infrastructure for a regenerative civilization.
          Starting here, in Ubud.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-cream/20" />
      </div>
    </section>
  );
}
