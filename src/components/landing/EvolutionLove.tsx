export function EvolutionLove() {
  return (
    <section className="section-cream section-padding">
      <div className="section-container">
        <h2 className="font-serif text-heading md:text-display-sm text-dark mb-8">
          Evolution + Love
        </h2>

        <div className="max-w-3xl mb-12">
          <p className="text-lg text-dark/80 leading-relaxed mb-6">
            Evo is a vision and a proposed strategy for how we can evolve the world
            (with love) to reflect our shared visions of the optimal life and the
            optimal world. Rooted in Tri Hita Karana (the Balinese philosophy of
            harmony with the self, others, and the divine), and born in Jakarta &amp;
            Ubud, we are experimenting with an approach to local, city / town based
            conscious evolution.
          </p>

          <blockquote className="border-l-2 border-gold pl-6 my-8 text-dark/60 italic">
            &ldquo;You never change things by fighting the existing reality. To change
            something, build a new model that makes the existing model obsolete.&rdquo;
            <span className="block mt-3 not-italic text-sm text-dark/40">
              &mdash; Buckminster Fuller
            </span>
          </blockquote>

          <p className="text-dark/70 leading-relaxed mb-6">
            Our aim is to identify, support, connect and collaborate with
            &lsquo;regenerators&rsquo; in and around Ubud and Jakarta to support each
            other towards building a better future for this archipelago and world we
            call Home. We have adopted the transition network model in Ubud, and are
            exploring the same for Jakarta, collaborating with Impact Hub.
          </p>

          <p className="text-dark/70 leading-relaxed mb-6">
            Our theory of change is simple: in order to enable the shift towards a more
            regenerative and loving future, we identify, connect, support, and
            collaborate with existing city / town based &lsquo;regen&rsquo; /
            &lsquo;evo&rsquo; hubs (like Mana Earthly Paradise), any eco / evo villages
            nearby (like Taman Petanu Eco Neighborhood), and a network of regenerative
            solution providers as a city / town guide for aligned products, services,
            restaurants, coworking spaces, resorts, classes, and events.
          </p>

          <p className="text-dark/70 leading-relaxed">
            This website describes this theory of change and, for registered members,
            offers a way to log in and fill in both a personal profile and a regen
            offering (place / product / service / class / event). This initiative is
            designed to be inclusive and decentralized. You are warmly invited.
            Welcome Home.
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
            title="Evo Platform"
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
