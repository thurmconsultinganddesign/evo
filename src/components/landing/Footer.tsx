import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-dark border-t border-white/5 px-6 py-12">
      <div className="mx-auto max-w-content">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-serif text-xl text-cream tracking-wide">
              evolove
            </Link>
            <p className="text-cream/30 text-sm mt-3 leading-relaxed">
              Evolving with love toward a regenerative world.
              A pilot platform for Ubud, Bali.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-cream/50 text-xs uppercase tracking-[0.15em] mb-4">
              Explore
            </h4>
            <div className="flex flex-col gap-2">
              <a href="#fundamentals" className="text-cream/30 text-sm hover:text-cream/60 transition-colors">
                The Fundamentals
              </a>
              <a href="#villages" className="text-cream/30 text-sm hover:text-cream/60 transition-colors">
                Evo Villages
              </a>
              <a href="#hubs" className="text-cream/30 text-sm hover:text-cream/60 transition-colors">
                Evo Hubs
              </a>
              <Link href="/partners" className="text-cream/30 text-sm hover:text-cream/60 transition-colors">
                Regen Partners
              </Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-cream/50 text-xs uppercase tracking-[0.15em] mb-4">
              Connect
            </h4>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-cream/30 text-sm hover:text-cream/60 transition-colors">
                Team Login
              </Link>
              <Link href="/partners/map" className="text-cream/30 text-sm hover:text-cream/60 transition-colors">
                Partner Map
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-cream/20 text-xs">
            &copy; {new Date().getFullYear()} Evolove. Ubud, Bali.
          </p>
          <p className="text-cream/20 text-xs">
            Built with care for a regenerative future.
          </p>
        </div>
      </div>
    </footer>
  );
}
