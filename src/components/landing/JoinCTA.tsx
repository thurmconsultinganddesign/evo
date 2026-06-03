export function JoinCTA() {
  return (
    <section className="section-dark section-padding">
      <div className="section-container text-center">
        {/* Decorative element */}
        <div className="flex justify-center mb-8">
          <svg className="w-8 h-8 text-gold/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </div>

        <h2 className="font-serif text-heading md:text-display-sm text-cream italic max-w-3xl mx-auto mb-8 leading-tight">
          Build the models that will render the status quo obsolete.
        </h2>

        <p className="text-cream/40 max-w-xl mx-auto mb-4 text-sm">
          — Buckminster Fuller
        </p>

        <p className="text-cream/50 max-w-2xl mx-auto leading-relaxed">
          An invitation to farmers, entrepreneurs, educators, technologists,
          policymakers, and communities rediscovering their relationship with
          the living Earth. We are building together, starting in Ubud.
        </p>
      </div>
    </section>
  );
}
