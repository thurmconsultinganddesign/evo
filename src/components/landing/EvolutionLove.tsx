export function EvolutionLove() {
  return (
    <section className="section-cream section-padding">
      <div className="section-container">
        <h2 className="font-serif text-heading md:text-display-sm text-dark mb-8">
          Evolution + Love
        </h2>

        <div className="max-w-3xl mb-12">
          <p className="text-lg text-dark/80 leading-relaxed mb-6">
            Evolove is the synthesis of conscious development and deep care. Rooted
            in Tri Hita Karana (the Balinese philosophy of harmony with the self, others,
            and the divine), we shift human systems from survival-based competition to
            heart-based collaboration.
          </p>

          <blockquote className="border-l-2 border-gold pl-6 my-8 text-dark/60 italic">
            &ldquo;The central contention of ecological civilization and social regeneration is work done in units of
            radical trust. It is a relational economic choice.&rdquo;
          </blockquote>

          <p className="text-dark/70 leading-relaxed">
            By building models that render the status quo obsolete, the
            platform provides every individual and community with the tools
            needed to move from extraction toward regeneration,
            developing each participant&apos;s fullest potential.
          </p>
        </div>

        {/* Three Pillars */}
        <div id="pillars" className="grid md:grid-cols-3 gap-8 mt-16">
          <PillarCard
            number="01"
            title="Evo Villages"
            description="Prototypes for regenerative living and thriving communities — located within 2-3 hours of major cities. Living laboratories for the future of human civilization."
          />
          <PillarCard
            number="02"
            title="Evo Hubs"
            description="City-based nodes of conscious evolution. Bringing together regenerative businesses, educators, artists, and community leaders to transform urban centers."
          />
          <PillarCard
            number="03"
            title="Evolove Platform"
            description="The digital coordination layer connecting villages, hubs, and people into a global network of regenerative collaboration. Starting here in Ubud."
          />
        </div>
      </div>
    </section>
  );
}

function PillarCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="border-t border-dark/10 pt-6">
      <span className="label-sm text-gold/80 mb-3 block">{number}</span>
      <h3 className="font-serif text-subheading text-dark mb-3">{title}</h3>
      <p className="text-dark/60 leading-relaxed text-sm">{description}</p>
    </div>
  );
}
