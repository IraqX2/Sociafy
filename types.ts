
export type ServiceCategory = 'followers' | 'likes' | 'comments' | 'views' | 'ads' | 'verification' | 'other';
export type Platform = 'facebook' | 'instagram' | 'youtube' | 'tiktok' | 'other';

export interface Service {
  id: string;
  name: string;
  platform: Platform;
  category: ServiceCategory;
  price: number;
  unitValue: number; // e.g., 1000 for 1k followers
  unitLabel: string; // e.g., "Followers"
  description: string;
  imageUrl: string;
  deliveryTime: string;
}

export interface CartItem {
  id: string; // unique cart entry ID
  serviceId: string;
  name: string;
  price: number;
  quantity: number; // multiplier of the package
  unitValue: number;
  category: ServiceCategory;
  platform: Platform;
}

export interface OrderInfo {
  name: string;
  mobile: string;
  whatsapp: string;
  personalFbLink: string;
  targetLink: string;
  description: string;
  email: string;
}
