
// Defined missing AppState option and the interfaces used in constants.tsx
export type AppState = 
  | 'LANDING' 
  | 'LOGIN' 
  | 'REGISTER'
  | 'DASHBOARD' 
  | 'LOOK_DETAILS' 
  | 'PROFILE'
  | 'GENERATING';

export interface StyleQuestionOption {
  id: string;
  label: string;
  description: string;
  icon: string;
}

export interface ClimateChoice {
  id: string;
  name: string;
  icon: string;
}

export interface OutfitItem {
  name: string;
  category: string;
  detail: string;
  imageUrl: string;
}

export interface GeneratedLook {
  id: string;
  name: string;
  description: string;
  items: OutfitItem[];
  vibeTag: string;
  mainImageUrl: string;
}

export interface UserProfile {
  uid?: string;
  email?: string;
  username: string;
  handle: string;
  bio: string;
  avatar: string;
  fitsGenerated: number;
  views: string;
}