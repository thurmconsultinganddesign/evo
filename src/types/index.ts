export interface Profile {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  linkedin_url: string | null;
  social_links: SocialLinks | null;
  purpose_statement: string | null;
  health_score: number | null;
  health_reflection: string | null;
  relationships_score: number | null;
  relationships_reflection: string | null;
  career_score: number | null;
  career_reflection: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface SocialLinks {
  instagram?: string;
  twitter?: string;
  facebook?: string;
  website?: string;
  [key: string]: string | undefined;
}

export interface RegenPartner {
  id: string;
  created_by: string;
  business_name: string;
  short_description: string | null;
  category: PartnerCategory;
  sustainability_statement: string | null;
  website_url: string | null;
  offerings_url: string | null;
  photos: string[];
  google_maps_url: string | null;
  contact_details: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
  updated_at: string;
}

export type PartnerCategory =
  | 'Eco Village'
  | 'Hub'
  | 'Product'
  | 'Service'
  | 'Educational'
  | 'Restaurant'
  | 'Eco Resort'
  | 'Events';

export const PARTNER_CATEGORIES: PartnerCategory[] = [
  'Eco Village',
  'Hub',
  'Product',
  'Service',
  'Educational',
  'Restaurant',
  'Eco Resort',
  'Events',
];
