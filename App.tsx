
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  MessageCircle, 
  CheckCircle2, 
  ArrowLeft, 
  ArrowRight,
  ChevronRight, 
  Trash2, 
  Copy, 
  Facebook, 
  Instagram, 
  Youtube,
  ShieldCheck, 
  ArrowUpRight, 
  Check, 
  Clock, 
  Phone, 
  User, 
  AtSign, 
  Link2, 
  FileText,
  Plus,
  Minus,
  LayoutGrid,
  CreditCard,
  Zap,
  Star,
  ZapIcon,
  MousePointer2,
  Wallet2,
  HelpCircle,
  CopyIcon,
  Award
} from 'lucide-react';
import { CartItem, Service, OrderInfo, ServiceCategory, Platform } from './types';
import { SERVICES, SOCIAFY_INFO, REVIEWS } from './constants';

// --- Context ---
interface CartContextType {
  cart: CartItem[];
  addToCart: (service: Service) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, q: number) => void;
  clearCart: () => void;
  total: number;
  detailedSummaries: { label: string; value: string }[];
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setOrderCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('sociafy_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sociafy_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (service: Service) => {
    const existing = cart.find(i => i.serviceId === service.id);
    if (existing) {
      updateQuantity(existing.id, existing.quantity + 1);
      return;
    }
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      serviceId: service.id,
      name: service.name,
      price: service.price,
      quantity: 1,
      unitValue: service.unitValue,
      category: service.category,
      platform: service.platform
    };
    setOrderCart(prev => [...prev, newItem]);
  };

  const updateQuantity = (id: string, q: number) => {
    if (q <= 0) {
      removeFromCart(id);
      return;
    }
    setOrderCart(prev => prev.map(item => item.id === id ? { ...item, quantity: q } : item));
  };

  const removeFromCart = (id: string) => setOrderCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setOrderCart([]);

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const detailedSummaries = useMemo(() => {
    const categories: Record<string, number> = {};
    
    cart.forEach(item => {
      let key = item.category.charAt(0).toUpperCase() + item.category.slice(1);
      if (item.category === 'ads') {
        key = "Ads ($)";
        categories[key] = (categories[key] || 0) + (item.unitValue * item.quantity);
      } else if (item.category === 'followers') {
        const platformKey = item.platform === 'facebook' ? 'FB Followers' : 'IG Followers';
        categories[platformKey] = (categories[platformKey] || 0) + (item.unitValue * item.quantity);
      } else if (item.category === 'verification') {
        key = "Blue Badge (Months)";
        categories[key] = (categories[key] || 0) + (item.unitValue * item.quantity);
      } else {
        categories[key] = (categories[key] || 0) + (item.unitValue * item.quantity);
      }
    });

    return Object.entries(categories).map(([label, val]) => ({
      label,
      value: val.toLocaleString()
    }));
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, detailedSummaries, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

// --- Navbar ---
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { itemCount } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Reviews', path: '/reviews' },
  ];

  return (
    <nav className="fixed w-full z-50 border-b shadow-sm backdrop-blur-sm transition-all duration-500 bg-white/95 border-pink-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-4">
            {location.pathname !== '/' && (
              <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 text-slate-900">
                <ArrowLeft size={20} />
              </button>
            )}
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-heading font-black tracking-tighter text-slate-900 leading-none">Sociafy</span>
              <span className="text-[9px] font-black text-pink-500 uppercase tracking-widest mt-0.5">Since 2021</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${location.pathname === link.path ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500'}`}>
                {link.name}
              </Link>
            ))}
            <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-green-600">
              <MessageCircle size={14} /> Get Help
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-3 rounded-2xl transition-all text-slate-900 bg-pink-50 hover:bg-pink-100">
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-900">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden h-screen p-8 space-y-8 animate-in slide-in-from-top duration-300 bg-white text-slate-900">
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className="block text-2xl font-heading font-bold">{link.name}</Link>
          ))}
          <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-2xl font-heading font-bold text-green-600">
            <MessageCircle size={28} /> Get Help
          </a>
        </div>
      )}
    </nav>
  );
};

// --- Helper Components ---
const BanglaText: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className = "" }) => (
  <span className={`bangla-text ${className}`}>{children}</span>
);

const PlatformIcon: React.FC<{ platform: Platform, className?: string, size?: number }> = ({ platform, className, size = 20 }) => {
  switch(platform) {
    case 'facebook': return <Facebook className={`text-[#1877F2] ${className}`} size={size} />;
    case 'instagram': return <Instagram className={`text-[#E4405F] ${className}`} size={size} />;
    case 'youtube': return <Youtube className={`text-[#FF0000] ${className}`} size={size} />;
    case 'tiktok': return <div className="text-black font-black italic tracking-tighter">T</div>;
    default: return <LayoutGrid className={`text-slate-400 ${className}`} size={size} />;
  }
};

const getWhatsAppOrderLink = (cart: CartItem[], total: number) => {
  if (cart.length === 0) return SOCIAFY_INFO.whatsapp;
  const orderList = cart.map(item => `- ${item.name} (Qty: ${item.quantity}) = ${item.price * item.quantity}৳`).join('\n');
  const message = `Hello Sociafy! I want to place an order:\n\n${orderList}\n\nGrand Total: ${total}৳\n\nPlease let me know the payment process.`;
  return `${SOCIAFY_INFO.whatsapp}?text=${encodeURIComponent(message)}`;
};

// --- Home Page ---
const HomePage = () => {
  const { cart, addToCart, updateQuantity, total, itemCount } = useCart();
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-700">
      <section className="pt-48 pb-24 px-6 lg:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-block bg-pink-50 text-pink-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-pink-100">
          Premium Growth Since 2021
        </div>
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-slate-900 leading-[0.9] tracking-tighter mb-12 uppercase">
          Skyrocket Your <br/>
          <span className="text-pink-500 italic">Brand Identity.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
          <BanglaText>এখন আপনার পার্সোনাল আইডি বা বিজনেস পেজে লাইক, ফলোয়ার বা ভিউ নেওয়া একদম পানির মতো সহজ। ১০০% রিয়েল অথবা হাই-কোয়ালিটি বট — যা খুশি বেছে নিন।</BanglaText>
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <a href="#packages" className="bg-slate-900 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-pink-600 shadow-xl transition-all">
            See All Packages
          </a>
          <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-pink-100 text-pink-600 px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-pink-50 transition-all flex items-center justify-center gap-3">
            <MessageCircle size={18} /> Order via WhatsApp
          </a>
        </div>
      </section>

      {/* Packages Section */}
      <section id="packages" className="py-24 bg-slate-50 px-6 lg:px-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-4xl md:text-6xl font-heading font-black uppercase text-slate-900 mb-4 tracking-tighter">Choose Your Growth</h2>
            <p className="text-lg text-slate-400 font-medium"><BanglaText>আপনার সোশ্যাল প্রেজেন্স বাড়ানোর জন্য সেরা মেথড গুলো এখানে।</BanglaText></p>
          </div>

          {/* Sticky Mobile Quick-Cart Header */}
          {itemCount > 0 && (
            <div className="lg:hidden sticky top-24 z-40 bg-slate-900 text-white p-5 rounded-[30px] shadow-2xl flex items-center justify-between mb-8 animate-in slide-in-from-top duration-500 border border-white/10">
               <div className="flex items-center gap-4">
                 <div className="bg-pink-600 p-2.5 rounded-xl">
                   <ShoppingBag size={22} />
                 </div>
                 <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-0.5">Quick Cart</p>
                   <p className="text-2xl font-heading font-black text-pink-500 leading-none">{total}৳</p>
                 </div>
               </div>
               <button 
                 onClick={() => navigate('/cart')}
                 className="bg-pink-600 text-white px-7 py-3.5 rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl"
               >
                 Checkout
               </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((s) => {
              const item = cart.find(c => c.serviceId === s.id);
              const qty = item?.quantity || 0;

              return (
                <div key={s.id} className="bg-white rounded-[40px] border border-slate-100 p-8 flex flex-col gap-6 hover:shadow-2xl transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="w-1/3 aspect-square rounded-3xl overflow-hidden bg-slate-50 border border-slate-100">
                      <img src={s.imageUrl} className="w-full h-full object-cover transition-all duration-500" alt={s.name} />
                    </div>
                    <div className="bg-slate-50 p-3 rounded-2xl shadow-sm border border-slate-100">
                      <PlatformIcon platform={s.platform} size={24} />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-xl font-heading font-black text-slate-900 uppercase mb-2 leading-tight">{s.name}</h3>
                      <p className="text-xs text-slate-400 font-bold mb-6 min-h-[40px]"><BanglaText>{s.description}</BanglaText></p>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-8">
                        <span className="text-3xl font-heading font-black text-pink-600">{s.price}৳</span>
                        <span className="text-[11px] font-black uppercase text-slate-900 tracking-wider border-2 border-slate-900 px-4 py-2 rounded-full bg-slate-50 shadow-[4px_4px_0_#F472B6]">
                          Per {s.unitValue} {s.unitLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-slate-100 rounded-2xl overflow-hidden shadow-inner">
                          <button 
                            onClick={() => item && updateQuantity(item.id, qty - 1)}
                            className="p-4 hover:bg-slate-200 transition-colors text-slate-600 active:scale-95"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-heading font-black text-lg text-slate-900">{qty}</span>
                          <button 
                            onClick={() => addToCart(s)}
                            className="p-4 hover:bg-slate-200 transition-colors text-pink-600 active:scale-95"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        {qty > 0 && (
                          <div className="text-[10px] font-black text-pink-400 uppercase tracking-widest animate-in zoom-in duration-300">
                            Total: {(s.price * qty)}৳
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Growth Steps Section */}
      <section className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-slate-900 uppercase tracking-tighter mb-4"><BanglaText>মাত্র ৩টি সহজ ধাপে অর্ডার করুন</BanglaText></h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Simplicity is our priority</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center">
             <div className="relative group">
                <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
                  <MousePointer2 size={40} />
                </div>
                <h4 className="text-xl font-heading font-bold text-slate-900 mb-4 uppercase"><BanglaText>সার্ভিস বেছে নিন</BanglaText></h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed"><BanglaText>মার্কেটপ্লেস থেকে আপনার প্রয়োজনীয় সার্ভিস (রিয়েল বা বট) সিলেক্ট করুন।</BanglaText></p>
             </div>
             <div className="relative group">
                <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
                  <Wallet2 size={40} />
                </div>
                <h4 className="text-xl font-heading font-bold text-slate-900 mb-4 uppercase"><BanglaText>পেমেন্ট সম্পন্ন করুন</BanglaText></h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed"><BanglaText>বিকাশ বা নগদের মাধ্যমে নিরাপদ ভাবে পেমেন্ট করুন এবং ডিটেইলস সাবমিট করুন।</BanglaText></p>
             </div>
             <div className="relative group">
                <div className="w-24 h-24 bg-pink-50 text-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:bg-pink-500 group-hover:text-white transition-all shadow-sm">
                  <ZapIcon size={40} />
                </div>
                <h4 className="text-xl font-heading font-bold text-slate-900 mb-4 uppercase"><BanglaText>ডেলিভারি উপভোগ করুন</BanglaText></h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed"><BanglaText>আমাদের অটোমেটেড সিস্টেম আপনার অর্ডারের কাজ সাথে সাথে শুরু করে দিবে।</BanglaText></p>
             </div>
          </div>
        </div>
      </section>

      {/* Quick Feature Section */}
      <section className="py-24 bg-slate-50 px-6 lg:px-12 border-y border-slate-100">
         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Safe & Anonymous', desc: 'আমরা আপনার পাসওয়ার্ড চাই না। আপনার প্রাইভেসি আমাদের প্রথম গুরুত্ব।', icon: CreditCard },
              { title: 'Quality Assurance', desc: 'আমাদের সার্ভিস গুলো ড্রপ-রেজিস্ট্যান্ট এবং অ্যালগরিদম ফ্রেন্ডলি।', icon: ShieldCheck },
              { title: '24/7 Support', desc: 'যেকোনো প্রয়োজনে আমাদের হোয়াটসঅ্যাপ টিম সবসময় আপনার পাশে আছে।', icon: Zap }
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] shadow-sm border border-slate-100 hover:shadow-xl transition-all group">
                <f.icon className="text-pink-500 mb-6 group-hover:scale-110 transition-transform" size={40} />
                <h4 className="text-xl font-heading font-bold text-slate-900 mb-2">{f.title}</h4>
                <p className="text-slate-500 font-medium text-sm leading-relaxed"><BanglaText>{f.desc}</BanglaText></p>
              </div>
            ))}
         </div>
      </section>
    </div>
  );
};

// --- View Cart / Details Page ---
const CartPage = () => {
  const { cart, removeFromCart, total, detailedSummaries, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    name: '', mobile: '', whatsapp: '', personalFbLink: '', targetLink: '', description: '', email: ''
  });

  const waOrderLink = useMemo(() => getWhatsAppOrderLink(cart, total), [cart, total]);

  const getExample = (fieldName: string) => {
    switch(fieldName) {
      case 'name': return 'e.g. Nayeem Uddin';
      case 'mobile': return 'e.g. 01846-119500';
      case 'whatsapp': return 'e.g. 018XXXXXXXXX';
      case 'email': return 'e.g. example@gmail.com';
      case 'personalFbLink': return 'e.g. fb.com/nayeem.profile';
      case 'targetLink': return 'e.g. fb.com/yourpage/post/123';
      default: return 'Example text here';
    }
  }

  if (cart.length === 0) return (
    <div className="pt-60 text-center min-h-screen px-6">
      <h2 className="text-4xl font-heading font-black uppercase text-slate-900 mb-6">Cart is Empty</h2>
      <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-pink-600 underline">Back to Home</Link>
    </div>
  );

  return (
    <div className="pt-40 pb-32 bg-slate-50 px-6 lg:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl font-heading font-black uppercase text-slate-900 mb-20 tracking-tighter">Finalize Order</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100">
               {cart.map(item => (
                 <div key={item.id} className="flex justify-between items-center py-8 border-b border-slate-50 last:border-0">
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3">
                        <PlatformIcon platform={item.platform} size={16} />
                        <h4 className="text-xl font-heading font-black uppercase text-slate-900">{item.name}</h4>
                      </div>
                      <div className="flex items-center bg-slate-50 rounded-xl px-4 py-2 border border-slate-100 w-fit">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-400 hover:text-pink-600"><Minus size={14}/></button>
                        <span className="mx-4 font-heading font-black text-slate-900 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-400 hover:text-pink-600"><Plus size={14}/></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-12">
                       <span className="text-2xl font-heading font-bold">{(item.price * item.quantity)}৳</span>
                       <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-500"><Trash2 size={24}/></button>
                    </div>
                 </div>
               ))}
               <div className="pt-8 flex justify-between items-center font-heading font-black text-slate-900 text-3xl">
                  <span>Grand Total</span>
                  <span className="text-pink-600">{total}৳</span>
               </div>
            </div>

            <div className="bg-white p-12 rounded-[50px] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-heading font-black uppercase mb-12 tracking-tight">Billing Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: 'Full Name', name: 'name', icon: User },
                  { label: 'Mobile Number *', name: 'mobile', icon: Phone },
                  { label: 'WhatsApp Number', name: 'whatsapp', icon: MessageCircle },
                  { label: 'Email Address', name: 'email', icon: AtSign },
                  { label: 'Your Profile Link', name: 'personalFbLink', icon: Link2 },
                  { label: 'Link to Boost/Promote', name: 'targetLink', icon: ArrowUpRight }
                ].map(f => (
                  <div key={f.name}>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                      <f.icon size={12}/> {f.label}
                    </label>
                    <input 
                      type="text" 
                      placeholder={getExample(f.name)}
                      onChange={e => setOrderInfo({...orderInfo, [f.name as keyof OrderInfo]: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl focus:outline-none focus:border-pink-500 font-bold placeholder:text-slate-300 placeholder:font-normal"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-[#0f172a] text-white p-12 rounded-[60px] shadow-2xl sticky top-40">
                <h3 className="text-3xl font-heading font-black uppercase mb-12">Summary</h3>
                <div className="bg-white/5 p-8 rounded-[40px] mb-12 space-y-4">
                  {detailedSummaries.map((summary) => (
                    <div key={summary.label} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>Total {summary.label}</span>
                      <span className="text-pink-500 text-sm">{summary.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/10 flex justify-between items-center mb-12">
                  <span className="text-xl font-bold uppercase text-white/60">Pay Now</span>
                  <span className="text-5xl font-heading font-black text-pink-500">{total}৳</span>
                </div>
                <button 
                  onClick={() => {
                    if (orderInfo.mobile.trim() !== '') {
                      localStorage.setItem('sociafy_pending_order_info', JSON.stringify(orderInfo));
                      navigate('/checkout');
                    } else {
                      alert('প্লিজ আপনার সঠিক মোবাইল নম্বরটি দিন (Mobile Number is required)');
                    }
                  }}
                  className="w-full bg-pink-600 py-6 rounded-3xl text-xl font-black uppercase tracking-widest hover:bg-pink-700 transition-all shadow-xl active:scale-95"
                >
                  Proceed to Settlement
                </button>
                
                <div className="mt-8 text-center">
                  <p className="text-[10px] font-black uppercase text-white/40 mb-4 tracking-widest">Confused? Get help instantly</p>
                  <a href={waOrderLink} target="_blank" rel="noopener noreferrer" className="bg-green-600 w-full py-5 rounded-3xl flex items-center justify-center gap-3 text-sm font-black uppercase tracking-widest hover:bg-green-700 transition-all shadow-lg">
                    <MessageCircle size={18} /> Chat with Expert
                  </a>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Checkout / Settlement Page ---
const CheckoutPage = () => {
  const { total, clearCart, cart, detailedSummaries } = useCart();
  const navigate = useNavigate();
  const [senderNumber, setSenderNumber] = useState('');
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const getThemeColor = () => method === 'bKash' ? '#D12053' : '#f97316';
  const paymentNumber = '01846119500';

  const handleCopy = () => {
    navigator.clipboard.writeText(paymentNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    const cleanedNumber = senderNumber.replace(/\D/g, ''); 
    if (cleanedNumber.length < 11) {
      alert("পেমেন্ট সম্পন্ন করার সঠিক নম্বরটি দিন (কমপক্ষে ১১ ডিজিট)।");
      return;
    }
    setIsProcessing(true);
    setTimeout(() => {
      clearCart();
      setOrderSuccess(true);
      setIsProcessing(false);
    }, 2000);
  };

  if (orderSuccess) return (
    <div className="pt-48 pb-32 min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-2xl w-full bg-white p-12 md:p-16 rounded-[60px] shadow-2xl border border-pink-100 text-center animate-in zoom-in duration-500">
         <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-10">
            <CheckCircle2 size={48} />
         </div>
         <h1 className="text-3xl md:text-4xl font-heading font-black uppercase text-slate-900 mb-6">আপনার অর্ডার কনফার্ম হয়েছে!</h1>
         <div className="space-y-4 mb-12">
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              <BanglaText>আমরা খুব শীঘ্রই আপনার সার্ভিসগুলো যাচাই করে কাজ শুরু করবো। ধন্যবাদ Sociafy-র সাথে থাকার জন্য।</BanglaText>
            </p>
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
              We will check your services and work on it ASAP!
            </p>
         </div>

         <div className="flex flex-col gap-4">
            <a 
              href={SOCIAFY_INFO.whatsapp} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bg-green-600 text-white w-full py-6 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-green-700 transition-all group"
            >
              <MessageCircle size={22} className="group-hover:scale-110 transition-transform" />
              <BanglaText>হোয়াটসঅ্যাপে যোগাযোগ করুন</BanglaText>
            </a>
            <button 
              onClick={() => navigate('/')} 
              className="text-slate-400 font-black uppercase tracking-widest text-[10px] hover:text-pink-600 transition-colors py-4"
            >
              Return Home
            </button>
         </div>
      </div>
    </div>
  );

  return (
    <div className="pt-40 pb-32 min-h-screen transition-colors duration-500 px-6 lg:px-12" style={{ backgroundColor: getThemeColor() + '10' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-grow">
            <h1 className="text-5xl font-heading font-black uppercase text-slate-900 mb-4 tracking-tighter">Settlement</h1>
            <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-12">Architecture for Growth & Influence</p>
            
            <div className="flex gap-4 mb-16">
              <button onClick={() => setMethod('bKash')} className={`flex-1 py-8 rounded-3xl font-black uppercase tracking-widest text-xs transition-all ${method === 'bKash' ? 'bg-[#D12053] text-white shadow-lg scale-105' : 'bg-white text-slate-400 border border-slate-100'}`}>bKash</button>
              <button onClick={() => setMethod('Nagad')} className={`flex-1 py-8 rounded-3xl font-black uppercase tracking-widest text-xs transition-all ${method === 'Nagad' ? 'bg-[#f97316] text-white shadow-lg scale-105' : 'bg-white text-slate-400 border border-slate-100'}`}>Nagad</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
                  <CreditCard className="text-slate-900" size={32} />
                </div>
                <h3 className="text-xl font-heading font-black uppercase text-slate-900 mb-4">Step 1</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-6">Action</p>
                <div className="bg-slate-900 text-white px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs">
                  Send Money
                </div>
                <p className="mt-6 text-slate-400 text-[11px] font-medium leading-relaxed"><BanglaText>বিকাশ বা নগদ অ্যাপ থেকে "Send Money" অপশনটি সিলেক্ট করুন। (পার্সোনাল নম্বর)</BanglaText></p>
              </div>

              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all relative overflow-hidden">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
                  <CopyIcon className="text-slate-900" size={32} />
                </div>
                <h3 className="text-xl font-heading font-black uppercase text-slate-900 mb-4">Step 2</h3>
                
                <div className="w-full space-y-4">
                  <div className="flex flex-col gap-2 w-full">
                    <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.3em]">Copy Number</p>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center justify-between bg-slate-100 px-6 py-4 rounded-2xl font-heading font-black text-slate-900 text-lg hover:bg-slate-200 transition-colors group/btn"
                    >
                      <span>{paymentNumber}</span>
                      {copied ? <Check size={20} className="text-green-600" /> : <CopyIcon size={20} className="text-slate-400 group-hover/btn:text-slate-900" />}
                    </button>
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-8">
                    <p className="text-slate-400 font-black uppercase text-[9px] tracking-[0.3em]">Put Your Number</p>
                    <input 
                      type="text" 
                      placeholder="e.g. 017XXXXXXXX"
                      value={senderNumber}
                      onChange={e => setSenderNumber(e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl font-heading font-black text-slate-900 text-center focus:outline-none focus:border-slate-900 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col items-center text-center group hover:shadow-xl transition-all">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mb-8 border border-slate-100 group-hover:scale-110 transition-transform">
                  <ZapIcon className="text-slate-900" size={32} />
                </div>
                <h3 className="text-xl font-heading font-black uppercase text-slate-900 mb-4">Step 3</h3>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mb-6">Finalize</p>
                <button 
                  onClick={handleSubmit}
                  disabled={isProcessing}
                  className="w-full py-6 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                  style={{ backgroundColor: getThemeColor() }}
                >
                  {isProcessing ? 'Verifying...' : 'Confirm Order'}
                </button>
                <p className="mt-6 text-slate-400 text-[11px] font-medium leading-relaxed"><BanglaText>পেমেন্ট সফল হলে কনফার্ম বাটনে ক্লিক করে অর্ডারটি সম্পন্ন করুন।</BanglaText></p>
              </div>
            </div>
            
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 text-center shadow-sm">
              <h4 className="text-lg font-heading font-black uppercase mb-4 text-slate-900">Payment Issue?</h4>
              <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-200 hover:scale-105 transition-all">
                <MessageCircle size={18} /> Chat with Payment Team
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-[#0f172a] text-white p-12 rounded-[60px] shadow-2xl sticky top-40">
              <h3 className="text-2xl font-heading font-black uppercase mb-8 border-b border-white/10 pb-4">Order Summary</h3>
              <div className="space-y-4 mb-12 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-xs border-b border-white/5 pb-4 last:border-0">
                    <span className="text-pink-500 font-black uppercase leading-tight pr-4">{item.name} x {item.quantity}</span>
                    <span className="font-black whitespace-nowrap">{(item.price * item.quantity)}৳</span>
                  </div>
                ))}
              </div>
              <div className="bg-white/5 p-6 rounded-3xl mb-12 space-y-3">
                {detailedSummaries.map((summary) => (
                  <div key={summary.label} className="flex justify-between text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                    <span>{summary.label}</span>
                    <span className="text-pink-500">{summary.value}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center px-2">
                <span className="text-white/40 font-black uppercase text-[10px] tracking-[0.3em]">Total Amount</span>
                <span className="text-5xl font-heading font-black text-pink-500 leading-none">{total}৳</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Reviews Page ---
const ReviewsPage = () => (
  <div className="pt-40 pb-32 bg-slate-50 px-6 lg:px-12 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-6xl md:text-7xl font-heading font-black uppercase text-slate-900 mb-6 tracking-tighter">What People Say</h1>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Architecture for Influence & Growth</p>
      </div>
      
      <div className="flex justify-center mb-24">
        <a 
          href={SOCIAFY_INFO.reviewsUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="bg-[#1877F2] text-white px-12 py-6 rounded-[30px] font-black uppercase tracking-widest text-sm flex items-center gap-4 hover:scale-105 hover:bg-[#115ec4] transition-all shadow-[0_20px_60px_rgba(24,119,242,0.3)] group active:scale-95"
        >
          <div className="bg-white/20 p-2 rounded-xl">
             <Facebook size={24} fill="white" />
          </div>
          <div className="text-left">
            <p className="text-[10px] opacity-70 mb-0.5">Verified Source</p>
            <span>View All Official Reviews</span>
          </div>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {REVIEWS.map((r, i) => (
          <div key={i} className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm relative group overflow-hidden flex flex-col hover:shadow-2xl transition-all hover:-translate-y-2 duration-500">
            <div className="flex items-center gap-2 mb-8">
               <div className="flex gap-0.5">
                 {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="#F472B6" stroke="#F472B6" />)}
               </div>
            </div>
            
            <p className="text-xl font-medium text-slate-700 italic mb-12 leading-relaxed font-heading relative z-10">
              <span className="text-pink-200 absolute -top-4 -left-4 text-6xl opacity-40 select-none">"</span>
              {r.text}
            </p>
            
            <div className="mt-auto pt-8 border-t border-slate-50 flex items-center justify-between">
               <div className="flex flex-col">
                  <span className="font-heading font-black uppercase text-slate-900 text-sm tracking-tight">{r.name}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                     <div className="bg-green-100 p-0.5 rounded-full">
                        <Check size={8} className="text-green-600" />
                     </div>
                     <span className="text-[9px] font-black text-green-600 uppercase tracking-widest">Verified Order</span>
                  </div>
               </div>
               <div className="bg-slate-50 p-2.5 rounded-2xl text-slate-200 group-hover:text-pink-500 transition-colors">
                  <ShieldCheck size={20} />
               </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-24 text-center">
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-8">Ready to start your growth journey?</p>
         <Link to="/" className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs shadow-xl hover:bg-pink-600 transition-all">
            Browse Packages <ArrowRight size={16} />
         </Link>
      </div>
    </div>
  </div>
);

// --- App ---
const App = () => (
  <CartProvider>
    <Router>
      <div className="min-h-screen flex flex-col selection:bg-pink-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Routes>
        </main>
        
        <footer className="bg-white pt-24 pb-16 border-t border-slate-100 px-6 lg:px-12 text-center">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col items-center gap-2 mb-6">
              <span className="text-3xl font-heading font-black tracking-tighter text-slate-900 block">Sociafy</span>
              <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Premium Digital Architecture Since 2021</span>
            </div>
            
            <div className="flex flex-col items-center gap-8 mb-12">
               <div className="flex gap-8">
                  <a href={SOCIAFY_INFO.facebook} target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:text-[#1877F2] hover:bg-[#1877F2]/5 transition-all shadow-sm">
                    <Facebook size={24} />
                  </a>
                  <a href={SOCIAFY_INFO.instagram} target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:text-[#E4405F] hover:bg-[#E4405F]/5 transition-all shadow-sm">
                    <Instagram size={24} />
                  </a>
                  <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-slate-50 p-4 rounded-2xl text-slate-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-sm">
                    <MessageCircle size={24} />
                  </a>
               </div>
               <div className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 flex flex-col md:flex-row gap-4 md:gap-8">
                 <span>Email: {SOCIAFY_INFO.email}</span>
                 <span>Direct: {SOCIAFY_INFO.phone}</span>
               </div>
               <div className="bg-pink-50 px-8 py-4 rounded-full border border-pink-100">
                  <p className="text-[10px] font-black uppercase text-pink-600 tracking-widest flex items-center gap-2">
                    <HelpCircle size={14} /> Need Help? Chat on WhatsApp for fast orders.
                  </p>
               </div>
            </div>

            <div className="pt-8 border-t border-slate-50 text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">
              © {new Date().getFullYear()} Sociafy Digital. Architecture for Influence.
            </div>
          </div>
        </footer>

        <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-3 pointer-events-none">
          <div className="bg-white px-4 py-2 rounded-xl shadow-xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity mb-1 hidden md:block">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-600">Chat with Expert</p>
          </div>
          <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="pointer-events-auto flex items-center gap-3 bg-[#25D366] text-white pr-6 pl-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-all group active:scale-95">
            <MessageCircle size={24} />
            <span className="font-heading font-black uppercase text-[10px] tracking-widest">Get Help Now</span>
          </a>
        </div>
      </div>
    </Router>
  </CartProvider>
);

export default App;
