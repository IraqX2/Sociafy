
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
  // 1) FB Bot Follow
  {
    id: 'fb-f-1k-bot',
    name: 'FB Bot Follow 1000',
    platform: 'facebook',
    category: 'followers',
    price: 120,
    unitValue: 1000,
    unitLabel: 'Bot Followers',
    deliveryTime: '12-24h',
    description: 'সল্প মূল্যে প্রোফাইল বা পেজের সংখ্যা বাড়াতে সাহায্য করে। দেখতে প্রফেশনাল।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767732848/How-to-Naturally-Get-More-Facebook-Follower_lnql5m.jpg'
  },
  // 2) BD real follower
  {
    id: 'fb-f-1k-real',
    name: 'FB BD Real Follower 1000',
    platform: 'facebook',
    category: 'followers',
    price: 220,
    unitValue: 1000,
    unitLabel: 'Real Followers',
    deliveryTime: '24-36h',
    description: '১০০% রিয়েল বিডি আইডি থেকে ফলোয়ার। আইডি বা পেজের ট্রাস্ট বাড়াতে সেরা।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767732848/How-to-Naturally-Get-More-Facebook-Follower_lnql5m.jpg'
  },
  // 3) post Reaction service
  {
    id: 'fb-reactions-1k',
    name: 'FB Post Reaction Service 1000',
    platform: 'facebook',
    category: 'likes',
    price: 200,
    unitValue: 1000,
    unitLabel: 'Reactions',
    deliveryTime: '12-24h',
    description: 'আপনার ফেসবুক পোস্টের রিঅ্যাকশন (Like, Love, Wow) বাড়াতে সাহায্য করে।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1768251930/16fc55a4-f6f9-499a-bda0-9e5e380f6899.png'
  },
  // 4) fb vid Views service
  {
    id: 'fb-v-5k',
    name: 'FB Vid Views Service 5000',
    platform: 'facebook',
    category: 'views',
    price: 100,
    unitValue: 5000,
    unitLabel: 'Views',
    deliveryTime: '24h',
    description: 'ফেসবুক রিলস বা ভিডিও ভিউজ। দ্রুত এনগেজমেন্ট বাড়াতে সাহায্য করবে।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767733986/8d1a8336-ac1c-4d19-b1ec-a12a5c86a285.png'
  },
  // 5) fb Boosting service
  {
    id: 'fb-ads',
    name: 'FB Boosting Service (Custom)',
    platform: 'facebook',
    category: 'ads',
    price: 160, 
    unitValue: 1,
    unitLabel: 'Dollar ($)',
    deliveryTime: 'Instant',
    description: 'ফেসবুক অ্যাড বুস্টিং সুবিধা। ডলার প্রতি ১৬০ টাকা। সঠিক অডিয়েন্স টার্গেটিং।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1768072735/aed2cca6-1842-44f1-bf1d-88b9b10b9c4e.png'
  },
  // 6) IG Follow service (International)
  {
    id: 'ig-f-1k',
    name: 'IG International Follow Service 1000',
    platform: 'instagram',
    category: 'followers',
    price: 250,
    unitValue: 1000,
    unitLabel: 'Followers',
    deliveryTime: '24h',
    description: 'ইন্টারন্যাশনাল হাই কোয়ালিটি প্রোফাইল ফলোয়ার। ড্রপ হওয়ার ভয় নেই।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1767733641/EasyRate-Instagram-Followers_fknmwz.png'
  },
  // 7) fb Verified
  {
    id: 'fb-verify',
    name: 'FB Verified Badge Service',
    platform: 'facebook',
    category: 'verification',
    price: 1200,
    unitValue: 1,
    unitLabel: 'Month Subscription',
    deliveryTime: '7-15 Days',
    description: 'আইডি বা পেজ ভেরিফিকেশন সার্ভিস (প্রতি মাস)। সিকিউর ও অফিসিয়াল মেথড।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1768072790/bcc4d2fc-3102-42e1-9004-052c517188ed.png'
  },
  // 8) Comment service
  {
    id: 'fb-c-100',
    name: 'FB Comment Service 100',
    platform: 'facebook',
    category: 'comments',
    price: 200,
    unitValue: 100,
    unitLabel: 'Custom Comments',
    deliveryTime: '24-36h',
    description: 'আপনার পছন্দমতো কাস্টম কমেন্ট। পেজের বিশ্বস্ততা বাড়ায়।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1768251572/ec8c5284-e858-4f5f-b624-1bc3d8833e66.png'
  },
  // TikTok Coins
  {
    id: 'tiktok-coins-100',
    name: 'TikTok Coins (100 Coins)',
    platform: 'tiktok',
    category: 'other',
    price: 205,
    unitValue: 100,
    unitLabel: 'Coins',
    deliveryTime: 'Instant',
    description: 'টিকটক কয়েন রিচার্জ। দ্রুত ডেলিভারি এবং ১০০% সেফ মেথড।',
    imageUrl: 'https://res.cloudinary.com/dx9efyuos/image/upload/v1768251042/2db3f20a-ace1-4be2-adcd-47aa9dcb0c43.png'
  }
];

export const REVIEWS = [
  { name: 'Adnan Sami', text: 'অসাধারণ সার্ভিস। ফলোয়ারগুলো দেখতে একদম রিয়েল। ডেলিভারি টাইমলি পেয়েছি।' },
  { name: 'Tahmid Hasan', text: 'খুবই দ্রুত ডেলিভারি পেয়েছি। বাংলাদেশের মধ্যে সেরা কোয়ালিটি প্যানেল।' },
  { name: 'Sarah Khan', text: 'ভিডিও ভিউ অনেক হেল্প করেছে রিচ বাড়াতে। রিলসগুলো এখন ভাইরাল হচ্ছে।' },
  { name: 'Tanvir Rahman', text: 'অ্যাড বুস্টিং সার্ভিসটা জোস। টার্গেটেড কাস্টমার আসছে এখন আমার বিজনেস পেজে।' },
  { name: 'Nusrat Jahan', text: 'Instagram followers নিয়েছিলাম, ১ মাস পার হয়ে গেছে এখনো ড্রপ করেনি।' },
  { name: 'Imran Hossain', text: 'ফেসবুক ভেরিফাইড ব্যাজ নিয়ে কোনো ঝামেলা হয়নি। তাদের মেথড খুব সেফ।' },
  { name: 'Sabbir Ahmed', text: 'রিয়েল ফলোয়ারগুলো আমার পেজের ট্রাস্ট অনেক বাড়িয়ে দিয়েছে। ধন্যবাদ Sociafy!' },
  { name: 'Mehedi Hasan', text: 'বট ফলোয়ারগুলো প্রোফাইল দেখতে প্রফেশনাল করে দিয়েছে। প্রাইস হিসেবে সেরা।' },
  { name: 'Anika Tabassum', text: 'সাপোর্ট টিম অনেক হেল্পফুল। হোয়াটসঅ্যাপে মেসেজ দেওয়ার সাথে সাথেই রিপ্লাই পাই।' },
  { name: 'Rakib Hossain', text: 'ডলার রেট অনেক রিজনেবল। এখন থেকে এখানেই বুস্টিং করাবো।' },
  { name: 'Farhana Islam', text: 'ইউটিউব ভিউজ সার্ভিসটা ট্রাই করেছিলাম, অর্গানিক গ্রোথ দেখতে পারছি এখন।' },
  { name: 'Zayed Khan', text: 'কমেন্টগুলো খুব ন্যাচারাল মনে হয়। কোনো ফেক লুক নেই।' }
];
