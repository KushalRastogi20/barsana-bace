export interface Leela {
  id: number | string;
  title: string;
  subtitle: string;
  emoji: string;
  color: string;
  tag: string;
  slug?: string;
  coverImage?: string;
  mediaCount?: number;
}

export interface GalleryItem {
  id: number;
  emoji: string;
  label: string;
  color: string;
}

export interface Saint {
  id: number;
  name: string;
  subtitle: string;
  emoji: string;
  borderColor: string;
  glowColor: string;
  description: string;
  footer?: string;
}

export interface Goswami {
  name: string;
  emoji: string;
  role: string;
}

export const GALLERY_ITEMS: GalleryItem[] = [];
export const FEATURED_SAINTS: Saint[] = [];
export const SIX_GOSWAMIS: Goswami[] = [];
