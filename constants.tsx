
import { Service } from './types';

export const SOCIAFY_INFO = {
  owner: 'Nayeem Uddin',
  phone: '01846-119500',
  email: 'sociafybd@gmail.com',
  facebook: 'https://www.facebook.com/sociafybd',
  instagram: 'https://www.instagram.com/sociafybd',
  whatsapp: 'https://wa.me/8801846119500',
  reviewsUrl: 'https://www.facebook.com/sociafybd/reviews'
};

export const SERVICES: Service[] = [
  // Facebook Followers
  {
    id: 'fb-f-1k-real',
    name: 'FB Real Followers 1000',
    platform: 'facebook',
    category: 'followers',
    price: 220,
    unitValue: 1000,
    unitLabel: 'Real Followers',
    deliveryTime: '24-36h',
    description: 'রিয়েল আইডি থেকে ফলোয়ার। পার্সোনাল আইডি বা বিজনেস পেজের ট্রাস্ট বাড়াতে সেরা।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767732848/How-to-Naturally-Get-More-Facebook-Follower_lnql5m.jpg'
  },
  {
    id: 'fb-f-1k-bot',
    name: 'FB Bot Followers 1000',
    platform: 'facebook',
    category: 'followers',
    price: 120,
    unitValue: 1000,
    unitLabel: 'Bot Followers',
    deliveryTime: '12-24h',
    description: 'সল্প মূল্যে প্রোফাইল বা পেজের সংখ্যা বাড়াতে সাহায্য করে। দেখতে প্রফেশনাল।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767732848/How-to-Naturally-Get-More-Facebook-Follower_lnql5m.jpg'
  },
  // Instagram
  {
    id: 'ig-f-1k',
    name: 'IG Followers 1000',
    platform: 'instagram',
    category: 'followers',
    price: 250,
    unitValue: 1000,
    unitLabel: 'Followers',
    deliveryTime: '24h',
    description: 'অর্গানিক লুক সহ হাই কোয়ালিটি প্রোফাইল ফলোয়ার। ড্রপ হওয়ার ভয় নেই।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767733641/EasyRate-Instagram-Followers_fknmwz.png'
  },
  // Facebook Views
  {
    id: 'fb-v-5k',
    name: 'FB Video Views 5000',
    platform: 'facebook',
    category: 'views',
    price: 100,
    unitValue: 5000,
    unitLabel: 'Views',
    deliveryTime: '24h',
    description: 'ফেসবুক রিলস বা ভিডিও ভিউজ। দ্রুত এনগেজমেন্ট বাড়াতে সাহায্য করবে।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767733986/8d1a8336-ac1c-4d19-b1ec-a12a5c86a285.png'
  },
  // Facebook Ads
  {
    id: 'fb-ads',
    name: 'FB Ad Boosting (Custom Budget)',
    platform: 'facebook',
    category: 'ads',
    price: 155, 
    unitValue: 1,
    unitLabel: 'Dollar ($)',
    deliveryTime: 'Instant',
    description: 'ফেসবুক অ্যাড বুস্টিং সুবিধা। ডলার প্রতি মাত্র ১৫৫ টাকা। সঠিক অডিয়েন্স টার্গেটিং।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1768072735/aed2cca6-1842-44f1-bf1d-88b9b10b9c4e.png'
  },
  // Verification
  {
    id: 'fb-verify',
    name: 'FaceBook Verified Badge',
    platform: 'facebook',
    category: 'verification',
    price: 1400,
    unitValue: 1,
    unitLabel: 'Month Subscription',
    deliveryTime: '7-15 Days',
    description: 'Buy or Renew , আইডি বা পেজ ভেরিফিকেশন সার্ভিস (প্রতি মাস)। সিকিউর ও অফিসিয়াল মেথড।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1768072790/bcc4d2fc-3102-42e1-9004-052c517188ed.png'
  },
  {
    id: 'fb-c-100',
    name: 'FB Custom Comments 100',
    platform: 'facebook',
    category: 'comments',
    price: 200,
    unitValue: 100,
    unitLabel: 'Custom Comments',
    deliveryTime: '24-36h',
    description: 'আপনার পছন্দমতো কাস্টম কমেন্ট। পেজের বিশ্বস্ততা বাড়ায়।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767733986/8d1a8336-ac1c-4d19-b1ec-a12a5c86a285.png'
  }
];

export const REVIEWS = [
  { name: 'Adnan Sami', text: 'অসাধারণ সার্ভিস। ফলোয়ারগুলো দেখতে একদম রিয়েল।' },
  { name: 'Tahmid Hasan', text: 'খুবই দ্রুত ডেলিভারি পেয়েছি। বাংলাদেশের মধ্যে সেরা।' },
  { name: 'Sarah Khan', text: 'ভিডিও ভিউ অনেক হেল্প করেছে রিচ বাড়াতে।' }
];
