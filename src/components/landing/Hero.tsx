export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center section-dark section-padding pt-32">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-dark via-dark/95 to-dark" />

      <div className="relative section-container text-center">
        {/* Logo symbol — drop the PNG into /public/images/logo/ (see README there).
            Uses the white/night-mode version so it blends with the dark background. */}
        <img
          src="/images/logo/evo-symbol-white.png"
          alt=""
          className="mx-auto mb-4 h-20 md:h-24 w-auto"
        />

        <p className="font-serif text-3xl md:text-4xl text-cream tracking-wide mb-8">
          evo
        </p>

        <p className="label-sm mb-6">
          From Ubud with Love
        </p>

        <h1 className="font-serif text-display-sm md:text-display text-cream max-w-4xl mx-auto mb-8">
          A pilot project for conscious evolution
        </h1>

        <p className="text-lg md:text-xl text-cream/60 max-w-2xl mx-auto leading-relaxed">
          At Mana Earthly Paradise and Tony Raka&apos;s, a small group of
          regenerators are banding together to build something special. For all
          of us, starting with &lsquo;regenerators&rsquo; in and around Ubud.
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-cream/20" />
      </div>
    </section>
  );
}
