'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { label: 'Fundamentals', href: '#fundamentals' },
  { label: 'Villages', href: '#villages' },
  { label: 'Hubs', href: '#hubs' },
  { label: 'Partners', href: '#partners' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-dark/95 backdrop-blur-md border-b border-white/5'
          : 'bg-transparent'
      )}
    >
      <div className="mx-auto max-w-content px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl md:text-2xl text-cream tracking-wide">
          evolove
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-cream/60 hover:text-cream transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Link
            href="/login"
            className="text-sm px-5 py-2 border border-gold/40 text-gold hover:bg-gold/10 rounded transition-all duration-200"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-cream/60 hover:text-cream"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-dark/98 backdrop-blur-md border-t border-white/5">
          <div className="px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm text-cream/60 hover:text-cream py-2"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/login"
              className="text-sm px-5 py-2 border border-gold/40 text-gold hover:bg-gold/10 rounded text-center mt-2"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
