export function ThreeFundamentals() {
  return (
    <section id="fundamentals" className="section-dark section-padding">
      <div className="section-container">
        <p className="label-sm mb-4">The Foundation</p>

        <h2 className="font-serif text-heading md:text-display-sm text-cream max-w-3xl mb-6">
          Master the Fundamentals
        </h2>

        <p className="text-cream/50 max-w-2xl mb-16 leading-relaxed">
          Before we try to change the world, we get our own house in order.
          Evolove&apos;s signature belief: personal fundamentals must be solid before
          leading others. Every member focuses on three areas.
        </p>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <FundamentalCard
            number="01"
            title="Health"
            subtitle="Body, Mind, Spirit"
            description="Holistic wellbeing — mental, physical, emotional, spiritual. Including living on purpose. Your health is the vessel through which everything else flows."
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            }
          />
          <FundamentalCard
            number="02"
            title="Sacred Relationships"
            subtitle="Partners, Children, Parents"
            description="Being present and responsible in the relationships we hold most dear. Our wives, our kids, our parents — the bonds that ground us and give life meaning."
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            }
          />
          <FundamentalCard
            number="03"
            title="Career & Livelihood"
            subtitle="Purpose-Driven Work"
            description="The ways we earn to survive and thrive. Financial sustainability as a foundation — so we can serve from abundance, not scarcity."
            icon={
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            }
          />
        </div>
      </div>
    </section>
  );
}

function FundamentalCard({
  number,
  title,
  subtitle,
  description,
  icon,
}: {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group">
      <div className="border border-white/5 rounded-sm p-8 h-full hover:border-gold/20 transition-colors duration-300">
        <div className="text-gold/60 mb-6">{icon}</div>
        <span className="label-sm text-cream/30 mb-2 block">{number}</span>
        <h3 className="font-serif text-subheading text-cream mb-1">{title}</h3>
        <p className="text-gold/60 text-sm mb-4">{subtitle}</p>
        <p className="text-cream/50 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
