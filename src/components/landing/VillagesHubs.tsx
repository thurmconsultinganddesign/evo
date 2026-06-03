export function VillagesHubs() {
  return (
    <>
      {/* Evo Villages */}
      <section id="villages" className="section-cream section-padding">
        <div className="section-container">
          <p className="label-sm text-gold/80 mb-4">Living Laboratories</p>

          <h2 className="font-serif text-heading md:text-display-sm text-dark max-w-3xl mb-6">
            Evo Villages
          </h2>

          <div className="grid md:grid-cols-2 gap-12 md:gap-16">
            <div>
              <p className="text-dark/70 leading-relaxed mb-6">
                Regenerative, resilient, economically thriving communities designed
                for a high quality of life in harmony with nature, technology, and
                human potential. Not retreats from the world — prototypes for a
                better one.
              </p>
              <p className="text-dark/60 leading-relaxed">
                Located within 2–3 hours of major cities, each village integrates
                regenerative agriculture, ecological architecture, wellness systems,
                education, and thriving local economies.
              </p>
            </div>

            <div className="space-y-4">
              <VillageFeature label="Regenerative agriculture & food systems" />
              <VillageFeature label="Ecological architecture & natural building" />
              <VillageFeature label="Wellness & leadership development" />
              <VillageFeature label="Clean energy & water systems" />
              <VillageFeature label="Cultural & educational programs" />
              <VillageFeature label="Community governance experiments" />
            </div>
          </div>

          {/* Village-Hub Loop */}
          <div className="mt-20 border-t border-dark/10 pt-12">
            <h3 className="font-serif text-subheading text-dark mb-6">
              The Urban–Rural Exchange Loop
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-dark/5 rounded-sm p-6">
                <p className="text-sm font-medium text-dark mb-3">City → Village (via Hubs)</p>
                <p className="text-dark/60 text-sm leading-relaxed">
                  Visitors and participants, talent and entrepreneurs, capital and
                  partnerships, new ideas and innovation flow from urban centers into
                  regenerative villages.
                </p>
              </div>
              <div className="bg-dark/5 rounded-sm p-6">
                <p className="text-sm font-medium text-dark mb-3">Village → City (via Hubs)</p>
                <p className="text-dark/60 text-sm leading-relaxed">
                  Regenerative products, educational experiences, proven models and
                  solutions, cultural richness and inspiration flow back into cities
                  through the hub network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Evo Hubs */}
      <section id="hubs" className="section-dark section-padding">
        <div className="section-container">
          <p className="label-sm mb-4">City-Based Activation</p>

          <h2 className="font-serif text-heading md:text-display-sm text-cream max-w-3xl mb-6">
            Evo Hubs
          </h2>

          <p className="text-cream/60 max-w-2xl mb-12 leading-relaxed">
            More than half of humanity lives in cities. Any meaningful transition
            toward a regenerative civilization must be rooted in urban
            transformation. Evo Hubs are the local engines of that change.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <HubCard
              title="Community Activation"
              description="Gatherings, workshops, and salons that build the local regenerative ecosystem from the ground up."
            />
            <HubCard
              title="Physical Spaces"
              description="Co-working, event venues, regenerative cafes — living interfaces where ideas become action."
            />
            <HubCard
              title="Partner Networks"
              description="Curated networks of regenerative businesses, educators, artists, and community leaders."
            />
            <HubCard
              title="Impact Programs"
              description="Incubation, leadership development, and policy dialogues that scale regenerative solutions."
            />
          </div>
        </div>
      </section>
    </>
  );
}

function VillageFeature({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 text-dark/70">
      <span className="w-1.5 h-1.5 rounded-full bg-gold/60 flex-shrink-0" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

function HubCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="border border-white/5 rounded-sm p-6 hover:border-gold/20 transition-colors duration-300">
      <h3 className="text-cream text-sm font-medium mb-3">{title}</h3>
      <p className="text-cream/40 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
