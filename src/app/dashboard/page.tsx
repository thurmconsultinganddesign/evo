import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Check if profile exists and has a name (onboarding complete)
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, avatar_url')
    .eq('id', user.id)
    .single();

  if (!profile?.full_name) {
    redirect('/profile?onboarding=true');
  }

  return (
    <div className="min-h-screen bg-dark">
      {/* Top bar */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto max-w-content flex items-center justify-between">
          <Link href="/" className="font-serif text-xl text-cream tracking-wide">
            evolove
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/profile" className="text-sm text-cream/60 hover:text-cream transition-colors">
              My Profile
            </Link>
            <Link href="/team" className="text-sm text-cream/60 hover:text-cream transition-colors">
              Team
            </Link>
            <Link href="/partners" className="text-sm text-cream/60 hover:text-cream transition-colors">
              Partners
            </Link>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm text-cream/40 hover:text-cream/60 transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="px-6 py-16">
        <div className="mx-auto max-w-content">
          <p className="label-sm mb-4">Welcome back</p>
          <h1 className="font-serif text-display-sm text-cream mb-8">
            {profile.full_name}
          </h1>

          <div className="grid md:grid-cols-3 gap-6">
            <DashboardCard
              title="My Profile"
              description="Update your bio, purpose statement, and reflect on your fundamentals."
              href="/profile"
            />
            <DashboardCard
              title="Team Directory"
              description="See other team members who have made their profiles visible."
              href="/team"
            />
            <DashboardCard
              title="Regen Partners"
              description="Browse the regenerative partner directory or add a new listing."
              href="/partners"
            />
          </div>
        </div>
      </main>
    </div>
  );
}

function DashboardCard({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="block border border-white/5 rounded-sm p-6 hover:border-gold/20 transition-colors duration-300"
    >
      <h2 className="text-cream font-medium mb-2">{title}</h2>
      <p className="text-cream/40 text-sm leading-relaxed">{description}</p>
    </Link>
  );
}
