'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { Profile } from '@/types';

interface ProfileEditorProps {
  userId: string;
  profile: Profile | null;
  isOnboarding: boolean;
}

export function ProfileEditor({
  userId,
  profile,
  isOnboarding,
}: ProfileEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bio, setBio] = useState(profile?.bio ?? '');
  const [linkedinUrl, setLinkedinUrl] = useState(profile?.linkedin_url ?? '');
  const [instagram, setInstagram] = useState(
    profile?.social_links?.instagram ?? '',
  );
  const [twitter, setTwitter] = useState(
    profile?.social_links?.twitter ?? '',
  );
  const [website, setWebsite] = useState(
    profile?.social_links?.website ?? '',
  );
  const [purposeStatement, setPurposeStatement] = useState(
    profile?.purpose_statement ?? '',
  );
  const [healthScore, setHealthScore] = useState(profile?.health_score ?? 5);
  const [healthReflection, setHealthReflection] = useState(
    profile?.health_reflection ?? '',
  );
  const [relationshipsScore, setRelationshipsScore] = useState(
    profile?.relationships_score ?? 5,
  );
  const [relationshipsReflection, setRelationshipsReflection] = useState(
    profile?.relationships_reflection ?? '',
  );
  const [careerScore, setCareerScore] = useState(
    profile?.career_score ?? 5,
  );
  const [careerReflection, setCareerReflection] = useState(
    profile?.career_reflection ?? '',
  );
  const [isVisible, setIsVisible] = useState(profile?.is_visible ?? false);

  // UI state
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const clearFeedback = useCallback(() => {
    setFeedback(null);
  }, []);

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please select an image file.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({
        type: 'error',
        message: 'Image must be smaller than 5MB.',
      });
      return;
    }

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    setUploading(true);
    setFeedback(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const fileExt = file.name.split('.').pop();
      const filePath = `${userId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from('avatars').getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to upload image.',
      });
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!fullName.trim()) {
      setFeedback({ type: 'error', message: 'Full name is required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const supabase = createBrowserSupabaseClient();

      const profileData = {
        id: userId,
        full_name: fullName.trim(),
        avatar_url: avatarUrl || null,
        bio: bio.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        social_links: {
          instagram: instagram.trim() || undefined,
          twitter: twitter.trim() || undefined,
          website: website.trim() || undefined,
        },
        purpose_statement: purposeStatement.trim() || null,
        health_score: healthScore,
        health_reflection: healthReflection.trim() || null,
        relationships_score: relationshipsScore,
        relationships_reflection: relationshipsReflection.trim() || null,
        career_score: careerScore,
        career_reflection: careerReflection.trim() || null,
        is_visible: isVisible,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

      if (error) throw error;

      setFeedback({
        type: 'success',
        message: isOnboarding
          ? 'Profile created! Redirecting to your dashboard...'
          : 'Profile updated successfully.',
      });

      if (isOnboarding) {
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        setTimeout(clearFeedback, 4000);
      }
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to save profile.',
      });
    } finally {
      setSaving(false);
    }
  }

  const displayAvatar = avatarPreview || avatarUrl;

  return (
    <div className="min-h-screen bg-dark">
      {/* Header */}
      <header className="border-b border-white/5 px-6 py-4">
        <div className="mx-auto flex max-w-content items-center justify-between">
          <Link
            href="/"
            className="font-serif text-xl tracking-wide text-cream"
          >
            evolove
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-cream/60 transition-colors hover:text-cream"
          >
            &larr; Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Page heading */}
          <div className="mb-12">
            <p className="label-sm mb-4">
              {isOnboarding ? 'Welcome' : 'Your Profile'}
            </p>
            <h1 className="font-serif text-display-sm text-cream">
              {isOnboarding ? 'Complete Your Profile' : 'Edit Profile'}
            </h1>
            {isOnboarding && (
              <p className="mt-4 text-sage leading-relaxed">
                Tell us about yourself so the community can get to know you.
                You can always update this later.
              </p>
            )}
          </div>

          {/* Feedback banner */}
          {feedback && (
            <div
              className={cn(
                'mb-8 rounded-lg border p-4 text-sm',
                feedback.type === 'success'
                  ? 'border-forest/30 bg-forest/10 text-cream'
                  : 'border-terracotta/30 bg-terracotta/10 text-terracotta-light',
              )}
            >
              {feedback.message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-16">
            {/* ─── SECTION: Basic Info ─── */}
            <section>
              <h2 className="font-serif text-subheading text-cream mb-8">
                Basic Info
              </h2>

              <div className="space-y-6">
                {/* Avatar */}
                <div>
                  <label className="label-sm mb-3 block">Photo</label>
                  <div className="flex items-center gap-6">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className={cn(
                        'relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-2 border-dashed transition-colors',
                        displayAvatar
                          ? 'border-white/10 hover:border-gold/40'
                          : 'border-white/10 hover:border-gold/40',
                      )}
                    >
                      {displayAvatar ? (
                        <Image
                          src={displayAvatar}
                          alt="Avatar preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-dark-100">
                          <svg
                            className="h-8 w-8 text-cream/20"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                            />
                          </svg>
                        </div>
                      )}
                      {uploading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-dark/70">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-gold border-t-transparent" />
                        </div>
                      )}
                    </button>
                    <div>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="text-sm text-gold transition-colors hover:text-gold-light disabled:opacity-50"
                      >
                        {displayAvatar ? 'Change photo' : 'Upload photo'}
                      </button>
                      <p className="mt-1 text-xs text-cream/30">
                        JPG, PNG, or WebP. Max 5MB.
                      </p>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </div>

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="label-sm mb-2 block">
                    Full Name <span className="text-terracotta">*</span>
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="label-sm mb-2 block">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="A few words about yourself..."
                    className="w-full resize-none rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* LinkedIn */}
                <div>
                  <label htmlFor="linkedin" className="label-sm mb-2 block">
                    LinkedIn
                  </label>
                  <input
                    id="linkedin"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourname"
                    className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Social Links */}
                <div>
                  <p className="label-sm mb-4">Social Links</p>
                  <div className="space-y-4">
                    <div>
                      <label
                        htmlFor="instagram"
                        className="mb-1.5 block text-sm text-cream/50"
                      >
                        Instagram
                      </label>
                      <input
                        id="instagram"
                        type="url"
                        value={instagram}
                        onChange={(e) => setInstagram(e.target.value)}
                        placeholder="https://instagram.com/yourhandle"
                        className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="twitter"
                        className="mb-1.5 block text-sm text-cream/50"
                      >
                        Twitter / X
                      </label>
                      <input
                        id="twitter"
                        type="url"
                        value={twitter}
                        onChange={(e) => setTwitter(e.target.value)}
                        placeholder="https://x.com/yourhandle"
                        className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="website"
                        className="mb-1.5 block text-sm text-cream/50"
                      >
                        Website
                      </label>
                      <input
                        id="website"
                        type="url"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ─── SECTION: Purpose ─── */}
            <section>
              <h2 className="font-serif text-subheading text-cream mb-2">
                Purpose
              </h2>
              <p className="mb-8 text-sm text-sage leading-relaxed">
                Using your unique strengths to do what makes you come alive,
                toward your vision of an optimal life and world.
              </p>

              <div>
                <label
                  htmlFor="purposeStatement"
                  className="label-sm mb-2 block"
                >
                  Purpose Statement
                </label>
                <textarea
                  id="purposeStatement"
                  rows={5}
                  value={purposeStatement}
                  onChange={(e) => setPurposeStatement(e.target.value)}
                  placeholder="What drives you? What are you building toward?"
                  className="w-full resize-none rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </section>

            {/* ─── SECTION: The Three Fundamentals ─── */}
            <section>
              <h2 className="font-serif text-subheading text-cream mb-2">
                The Three Fundamentals
              </h2>
              <p className="mb-10 text-sm text-sage leading-relaxed">
                Reflect honestly on where you are right now. These scores are
                private by default and help you track your own growth.
              </p>

              <div className="space-y-12">
                <FundamentalSlider
                  id="health"
                  label="Health"
                  description="Physical vitality, energy, nutrition, movement, sleep, and mental wellness."
                  score={healthScore}
                  onScoreChange={setHealthScore}
                  reflection={healthReflection}
                  onReflectionChange={setHealthReflection}
                />
                <FundamentalSlider
                  id="relationships"
                  label="Relationships"
                  description="Quality of your connections — romantic, family, friendships, and community."
                  score={relationshipsScore}
                  onScoreChange={setRelationshipsScore}
                  reflection={relationshipsReflection}
                  onReflectionChange={setRelationshipsReflection}
                />
                <FundamentalSlider
                  id="career"
                  label="Career"
                  description="Professional fulfillment, financial alignment, impact, and creative expression."
                  score={careerScore}
                  onScoreChange={setCareerScore}
                  reflection={careerReflection}
                  onReflectionChange={setCareerReflection}
                />
              </div>
            </section>

            {/* ─── SECTION: Privacy ─── */}
            <section>
              <h2 className="font-serif text-subheading text-cream mb-8">
                Privacy
              </h2>

              <label className="flex cursor-pointer items-start gap-4">
                <div className="relative mt-0.5 flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={(e) => setIsVisible(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div
                    className={cn(
                      'h-5 w-9 rounded-full transition-colors',
                      isVisible ? 'bg-gold' : 'bg-dark-300',
                    )}
                  />
                  <div
                    className={cn(
                      'absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-cream transition-transform',
                      isVisible && 'translate-x-4',
                    )}
                  />
                </div>
                <div>
                  <span className="text-sm text-cream">
                    Make my profile visible to other team members
                  </span>
                  <p className="mt-1 text-xs text-cream/30">
                    When enabled, your profile will appear in the team
                    directory. Your fundamental scores and reflections are
                    always private.
                  </p>
                </div>
              </label>
            </section>

            {/* ─── Submit ─── */}
            <div className="flex items-center gap-4 border-t border-white/5 pt-8">
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-lg bg-gold px-8 py-3 font-medium text-dark transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? 'Saving...'
                  : isOnboarding
                    ? 'Create Profile'
                    : 'Save Changes'}
              </button>
              {!isOnboarding && (
                <Link
                  href="/dashboard"
                  className="text-sm text-cream/40 transition-colors hover:text-cream/60"
                >
                  Cancel
                </Link>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FundamentalSlider — reusable score + reflection
   ───────────────────────────────────────────── */

function FundamentalSlider({
  id,
  label,
  description,
  score,
  onScoreChange,
  reflection,
  onReflectionChange,
}: {
  id: string;
  label: string;
  description: string;
  score: number;
  onScoreChange: (v: number) => void;
  reflection: string;
  onReflectionChange: (v: string) => void;
}) {
  const scoreColor =
    score <= 3
      ? 'text-terracotta'
      : score <= 6
        ? 'text-gold'
        : 'text-forest-light';

  const trackColor =
    score <= 3
      ? 'from-terracotta/60 to-terracotta'
      : score <= 6
        ? 'from-gold/60 to-gold'
        : 'from-forest/60 to-forest-light';

  const percentage = ((score - 1) / 9) * 100;

  return (
    <div className="space-y-4">
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <label htmlFor={`${id}-score`} className="label-sm">
            {label}
          </label>
          <span
            className={cn(
              'font-serif text-2xl tabular-nums transition-colors',
              scoreColor,
            )}
          >
            {score}
          </span>
        </div>
        <p className="text-xs text-cream/30 leading-relaxed">{description}</p>
      </div>

      {/* Slider */}
      <div className="relative pt-1 pb-2">
        {/* Track background */}
        <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-dark-200" />
        {/* Filled track */}
        <div
          className={cn(
            'absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full bg-gradient-to-r transition-all',
            trackColor,
          )}
          style={{ width: `${percentage}%` }}
        />
        {/* Scale markers */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-0">
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={cn(
                'h-1 w-1 rounded-full transition-colors',
                i + 1 <= score ? 'bg-transparent' : 'bg-dark-300',
              )}
            />
          ))}
        </div>
        {/* Native range input (accessible, styled transparent) */}
        <input
          id={`${id}-score`}
          type="range"
          min={1}
          max={10}
          step={1}
          value={score}
          onChange={(e) => onScoreChange(Number(e.target.value))}
          className="relative z-10 w-full cursor-pointer appearance-none bg-transparent
            [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-cream
            [&::-webkit-slider-thumb]:bg-dark [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_rgba(212,168,67,0.3)]
            [&::-webkit-slider-thumb]:transition-shadow
            [&::-webkit-slider-thumb]:hover:shadow-[0_0_0_5px_rgba(212,168,67,0.4)]
            [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-cream [&::-moz-range-thumb]:bg-dark
            [&::-moz-range-thumb]:shadow-[0_0_0_3px_rgba(212,168,67,0.3)]
            [&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:bg-transparent
            [&::-moz-range-track]:h-1 [&::-moz-range-track]:bg-transparent"
        />
        {/* Min / Max labels */}
        <div className="mt-1 flex justify-between">
          <span className="text-[10px] text-cream/20">1</span>
          <span className="text-[10px] text-cream/20">10</span>
        </div>
      </div>

      {/* Reflection */}
      <div>
        <label
          htmlFor={`${id}-reflection`}
          className="mb-1.5 block text-sm text-cream/50"
        >
          Reflection
        </label>
        <textarea
          id={`${id}-reflection`}
          rows={3}
          value={reflection}
          onChange={(e) => onReflectionChange(e.target.value)}
          placeholder={`Where are you at with your ${label.toLowerCase()}? What would you like to shift?`}
          className="w-full resize-none rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
        />
      </div>
    </div>
  );
}
