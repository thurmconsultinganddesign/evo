'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error' | 'not_allowed'>(
    'idle',
  );
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    const supabase = createBrowserSupabaseClient();

    // Check if email is on the allow-list
    const { data: allowed } = await supabase
      .from('allowed_emails')
      .select('email')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (!allowed) {
      setStatus('not_allowed');
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase().trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setStatus('error');
      setErrorMessage(error.message);
    } else {
      setStatus('sent');
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-dark px-6">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-serif text-display-sm text-cream">Sign In</h1>
          <p className="mt-3 text-sage">
            Enter your email to receive a magic link.
          </p>
        </div>

        {status === 'sent' ? (
          <div className="rounded-lg border border-forest/30 bg-forest/10 p-6 text-center">
            <p className="text-lg text-cream">Check your email</p>
            <p className="mt-2 text-sm text-sage">
              We sent a magic link to{' '}
              <span className="font-medium text-gold">{email}</span>. Click the
              link to sign in.
            </p>
          </div>
        ) : status === 'not_allowed' ? (
          <div className="rounded-lg border border-terracotta/30 bg-terracotta/10 p-6 text-center">
            <p className="text-lg text-cream">Invite Only</p>
            <p className="mt-2 text-sm text-sage">
              This platform is currently invite-only. If you believe you should
              have access, please contact the team.
            </p>
            <button
              onClick={() => {
                setStatus('idle');
                setEmail('');
              }}
              className="mt-4 text-sm text-gold hover:text-gold-light transition-colors"
            >
              Try a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="label-sm mb-2 block text-sage-light"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-terracotta">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full rounded-lg bg-gold px-6 py-3 font-medium text-dark transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
            >
              {status === 'loading' ? 'Checking...' : 'Send Magic Link'}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-sage transition-colors hover:text-gold"
          >
            &larr; Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
