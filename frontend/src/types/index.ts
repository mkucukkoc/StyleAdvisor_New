// ============================================================
// StyleAdvisor AI - Type Definitions
// ============================================================

// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  age?: number;
  height?: number;
  weight?: number;
  bodyType?: 'slim' | 'athletic' | 'average' | 'curvy' | 'plus-size';
  skinTone?: 'fair' | 'light' | 'medium' | 'tan' | 'dark' | 'deep';
  stylePreferences: StylePreference[];
  favoriteColors: string[];
  avoidColors: string[];
  budgetRange: BudgetRange;
  preferredRetailers: string[];
  notificationsEnabled: boolean;
  onboardingCompleted: boolean;
}

export interface StylePreference {
  id: string;
  name: string;
  icon: string;
  selected: boolean;
}

export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
}

// Analysis Types
export interface AnalysisRequest {
  id?: string;
  type: 'photo' | 'text' | 'both';
  imageBase64?: string;
  textPrompt?: string;
  occasion?: string;
  style?: string;
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  overallScore: number;
  colorHarmony: ScoreDetail;
  fitAssessment: ScoreDetail;
  styleCoherence: ScoreDetail;
  occasionMatch: ScoreDetail;
  improvements: Improvement[];
  outfitSuggestions: Outfit[];
  isPremiumContent: boolean;
}

export interface ScoreDetail {
  score: number;
  label: string;
  description: string;
  isPremiumLocked: boolean;
}

export interface Improvement {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

// Outfit Types
export interface Outfit {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  items: OutfitItem[];
  occasion: string;
  style: string;
  season: string;
  totalPrice: number;
  isPremiumLocked: boolean;
  isFavorite: boolean;
}

export interface OutfitItem {
  id: string;
  name: string;
  category: string;
  color: string;
  imageUrl?: string;
  price: number;
  brand: string;
  retailer: string;
  affiliateUrl?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl?: string;
  retailer: string;
  affiliateUrl: string;
  rating?: number;
  reviewCount?: number;
  colors: string[];
  sizes: string[];
  inStock: boolean;
  isFavorite: boolean;
}

// Wardrobe Types
export interface WardrobeItem {
  id: string;
  name: string;
  category: WardrobeCategory;
  color: string;
  brand?: string;
  imageBase64?: string;
  imageUrl?: string;
  purchaseDate?: string;
  price?: number;
  notes?: string;
  timesWorn: number;
  lastWorn?: string;
  isFavorite: boolean;
  createdAt: string;
}

export type WardrobeCategory = 
  | 'tops'
  | 'bottoms'
  | 'dresses'
  | 'outerwear'
  | 'shoes'
  | 'accessories'
  | 'bags'
  | 'jewelry';

// Subscription Types
export interface SubscriptionStatus {
  isPremium: boolean;
  plan: 'free' | 'monthly' | 'yearly' | 'lifetime';
  expiresAt?: string;
  analysisRemaining: number;
  analysisLimit: number;
  features: PremiumFeature[];
}

export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  isAvailable: boolean;
}

// API Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// UI Types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface Modal {
  id: string;
  type: 'limit-reached' | 'premium-required' | 'confirm' | 'custom';
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
}

// Navigation Types
export type RootStackParamList = {
  '(auth)': undefined;
  '(onboarding)': undefined;
  '(tabs)': undefined;
  '(modals)': undefined;
};
