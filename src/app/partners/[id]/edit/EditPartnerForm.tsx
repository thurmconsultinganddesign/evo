'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { PARTNER_CATEGORIES } from '@/types';
import type { PartnerCategory, RegenPartner } from '@/types';
import { LocationPicker } from '@/components/LocationPicker';

interface EditPartnerFormProps {
  partner: RegenPartner;
}

/**
 * Attempt to extract latitude and longitude from a Google Maps URL.
 * Supports patterns like:
 *   @-8.5069,115.2624
 *   !3d-8.5069!4d115.2624
 *   ?q=-8.5069,115.2624
 *   ll=-8.5069,115.2624
 */
function extractLatLng(url: string): { lat: number; lng: number } | null {
  const atMatch = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (atMatch) {
    return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };
  }

  const bangMatch = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (bangMatch) {
    return { lat: parseFloat(bangMatch[1]), lng: parseFloat(bangMatch[2]) };
  }

  const qMatch = url.match(/[?&](?:q|ll)=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (qMatch) {
    return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };
  }

  return null;
}

export function EditPartnerForm({ partner }: EditPartnerFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state — pre-populated from existing partner
  const [businessName, setBusinessName] = useState(partner.business_name);
  const [shortDescription, setShortDescription] = useState(
    partner.short_description ?? '',
  );
  const [category, setCategory] = useState<PartnerCategory>(partner.category);
  const [sustainabilityStatement, setSustainabilityStatement] = useState(
    partner.sustainability_statement ?? '',
  );
  const [websiteUrl, setWebsiteUrl] = useState(partner.website_url ?? '');
  const [offeringsUrl, setOfferingsUrl] = useState(
    partner.offerings_url ?? '',
  );
  const [googleMapsUrl, setGoogleMapsUrl] = useState(
    partner.google_maps_url ?? '',
  );
  const [latitude, setLatitude] = useState<number | null>(
    partner.latitude ?? null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    partner.longitude ?? null,
  );
  const [contactDetails, setContactDetails] = useState(
    partner.contact_details ?? '',
  );
  const [photoUrls, setPhotoUrls] = useState<string[]>(partner.photos ?? []);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>(
    partner.photos ?? [],
  );

  // UI state
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  function handleGoogleMapsUrlChange(value: string) {
    setGoogleMapsUrl(value);
    if (value.trim()) {
      const coords = extractLatLng(value.trim());
      if (coords) {
        setLatitude(coords.lat);
        setLongitude(coords.lng);
      }
    }
  }

  function handleLocationChange(lat: number | null, lng: number | null) {
    setLatitude(lat);
    setLongitude(lng);
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);

    for (const file of fileArray) {
      if (!file.type.startsWith('image/')) {
        setFeedback({
          type: 'error',
          message: 'Please select only image files.',
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFeedback({
          type: 'error',
          message: `"${file.name}" exceeds 5MB. Please use a smaller image.`,
        });
        return;
      }
    }

    if (photoUrls.length + fileArray.length > 5) {
      setFeedback({
        type: 'error',
        message: 'Maximum 5 photos allowed.',
      });
      return;
    }

    const previews = fileArray.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((prev) => [...prev, ...previews]);

    setUploading(true);
    setFeedback(null);

    try {
      const supabase = createBrowserSupabaseClient();
      const uploadedUrls: string[] = [];

      for (const file of fileArray) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${partner.created_by}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('partner-photos')
          .upload(filePath, file, { upsert: true });

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from('partner-photos').getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }

      setPhotoUrls((prev) => [...prev, ...uploadedUrls]);
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to upload photos.',
      });
      setPhotoPreviews((prev) =>
        prev.slice(0, prev.length - previews.length),
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }

  function removePhoto(index: number) {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!businessName.trim()) {
      setFeedback({ type: 'error', message: 'Business name is required.' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const supabase = createBrowserSupabaseClient();

      const partnerData = {
        business_name: businessName.trim(),
        short_description: shortDescription.trim() || null,
        category,
        sustainability_statement: sustainabilityStatement.trim() || null,
        website_url: websiteUrl.trim() || null,
        offerings_url: offeringsUrl.trim() || null,
        google_maps_url: googleMapsUrl.trim() || null,
        contact_details: contactDetails.trim() || null,
        photos: photoUrls,
        latitude,
        longitude,
      };

      const { error } = await supabase
        .from('regen_partners')
        .update(partnerData)
        .eq('id', partner.id);

      if (error) throw error;

      setFeedback({
        type: 'success',
        message: 'Changes saved! Redirecting...',
      });

      setTimeout(() => router.push(`/partners/${partner.id}`), 1500);
    } catch (err) {
      setFeedback({
        type: 'error',
        message:
          err instanceof Error ? err.message : 'Failed to save changes.',
      });
    } finally {
      setSaving(false);
    }
  }

  const displayPhotos =
    photoPreviews.length > 0 ? photoPreviews : photoUrls;

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
            href={`/partners/${partner.id}`}
            className="text-sm text-cream/60 transition-colors hover:text-cream"
          >
            &larr; Back to Partner
          </Link>
        </div>
      </header>

      <main className="px-6 py-12">
        <div className="mx-auto max-w-2xl">
          {/* Page heading */}
          <div className="mb-12">
            <p className="label-sm mb-4">Edit Listing</p>
            <h1 className="font-serif text-display-sm text-cream">
              Edit {partner.business_name}
            </h1>
            <p className="mt-4 text-sage leading-relaxed">
              Update the details for this regenerative partner listing.
            </p>
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
                {/* Business Name */}
                <div>
                  <label htmlFor="businessName" className="label-sm mb-2 block">
                    Business Name <span className="text-terracotta">*</span>
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Name of the business or project"
                    className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label
                    htmlFor="shortDescription"
                    className="label-sm mb-2 block"
                  >
                    Short Description
                  </label>
                  <textarea
                    id="shortDescription"
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="1-3 sentences about what this partner does"
                    className="w-full resize-none rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="label-sm mb-2 block">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as PartnerCategory)
                    }
                    className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {PARTNER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>

            {/* ─── SECTION: Sustainability ─── */}
            <section>
              <h2 className="font-serif text-subheading text-cream mb-2">
                Sustainability
              </h2>
              <p className="mb-8 text-sm text-sage leading-relaxed">
                Help visitors understand what makes this partner regenerative.
              </p>

              <div>
                <label
                  htmlFor="sustainabilityStatement"
                  className="label-sm mb-2 block"
                >
                  Sustainability Statement
                </label>
                <textarea
                  id="sustainabilityStatement"
                  rows={6}
                  value={sustainabilityStatement}
                  onChange={(e) =>
                    setSustainabilityStatement(e.target.value)
                  }
                  placeholder="Describe how this offering is regenerative. Consider covering: environmental practices, community impact, sourcing, and long-term sustainability goals."
                  className="w-full resize-none rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                />
                <p className="mt-2 text-xs text-cream/30">
                  Consider covering: environmental practices, community impact,
                  sourcing, and long-term sustainability goals.
                </p>
              </div>
            </section>

            {/* ─── SECTION: Links & Contact ─── */}
            <section>
              <h2 className="font-serif text-subheading text-cream mb-8">
                Links & Contact
              </h2>

              <div className="space-y-6">
                {/* Website */}
                <div>
                  <label htmlFor="websiteUrl" className="label-sm mb-2 block">
                    Website
                  </label>
                  <input
                    id="websiteUrl"
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Offerings URL */}
                <div>
                  <label
                    htmlFor="offeringsUrl"
                    className="label-sm mb-2 block"
                  >
                    Offerings / Pricing Link
                  </label>
                  <input
                    id="offeringsUrl"
                    type="url"
                    value={offeringsUrl}
                    onChange={(e) => setOfferingsUrl(e.target.value)}
                    placeholder="https://example.com/brochure"
                    className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Google Maps URL */}
                <div>
                  <label
                    htmlFor="googleMapsUrl"
                    className="label-sm mb-2 block"
                  >
                    Google Maps Link
                  </label>
                  <input
                    id="googleMapsUrl"
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => handleGoogleMapsUrlChange(e.target.value)}
                    placeholder="https://maps.google.com/..."
                    className="w-full rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                {/* Location Picker */}
                <div>
                  <label className="label-sm mb-2 block">
                    Pin Location on Map
                  </label>
                  <p className="mb-3 text-xs text-cream/30">
                    Search, click the map, or paste a Google Maps link above to
                    set the location.
                  </p>
                  <LocationPicker
                    latitude={latitude}
                    longitude={longitude}
                    onChange={handleLocationChange}
                  />
                </div>

                {/* Contact Details */}
                <div>
                  <label
                    htmlFor="contactDetails"
                    className="label-sm mb-2 block"
                  >
                    Contact Details
                  </label>
                  <textarea
                    id="contactDetails"
                    rows={3}
                    value={contactDetails}
                    onChange={(e) => setContactDetails(e.target.value)}
                    placeholder="Email, phone, WhatsApp, or any other contact info"
                    className="w-full resize-none rounded-lg border border-dark-300 bg-dark-100 px-4 py-3 text-cream placeholder:text-dark-300 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>
            </section>

            {/* ─── SECTION: Photos ─── */}
            <section>
              <h2 className="font-serif text-subheading text-cream mb-2">
                Photos
              </h2>
              <p className="mb-8 text-sm text-sage leading-relaxed">
                Add up to 5 photos. The first photo will be used as the
                thumbnail in the directory.
              </p>

              {/* Photo previews */}
              {displayPhotos.length > 0 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {displayPhotos.map((url, i) => (
                    <div
                      key={i}
                      className="relative h-24 w-24 overflow-hidden rounded-sm bg-dark-100"
                    >
                      <Image
                        src={url}
                        alt={`Photo ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(i)}
                        className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-dark/80 text-cream/60 hover:text-cream text-xs"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {displayPhotos.length < 5 && (
                <div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="text-sm text-gold transition-colors hover:text-gold-light disabled:opacity-50"
                  >
                    {uploading ? 'Uploading...' : '+ Upload photos'}
                  </button>
                  <p className="mt-1 text-xs text-cream/30">
                    JPG, PNG, or WebP. Max 5MB each.
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
              )}
            </section>

            {/* ─── Submit ─── */}
            <div className="flex items-center gap-4 border-t border-white/5 pt-8">
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-lg bg-gold px-8 py-3 font-medium text-dark transition-colors hover:bg-gold-light disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href={`/partners/${partner.id}`}
                className="text-sm text-cream/40 transition-colors hover:text-cream/60"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
