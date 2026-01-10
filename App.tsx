
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
  HelpCircle
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

  // User requested precise labels for categories, especially Ads (Dollars) and Followers (Platform specific)
  const detailedSummaries = useMemo(() => {
    const categories: Record<string, number> = {};
    
    // Group items by a more descriptive key if requested (e.g., "FB Followers", "Ads ($)")
    cart.forEach(item => {
      let key = item.category.charAt(0).toUpperCase() + item.category.slice(1);
      if (item.category === 'ads') {
        key = "Ads (USD $)";
        categories[key] = (categories[key] || 0) + (item.unitValue * item.quantity);
      } else if (item.category === 'followers') {
        const platformKey = item.platform === 'facebook' ? 'FB Followers' : 'IG Followers';
        categories[platformKey] = (categories[platformKey] || 0) + (item.unitValue * item.quantity);
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
    { name: 'Marketplace', path: '/services' },
    { name: 'Sponsor', path: '/web-service' },
    { name: 'Reviews', path: '/reviews' },
  ];

  const isDark = location.pathname === '/web-service';

  return (
    <nav className={`fixed w-full z-50 border-b shadow-sm backdrop-blur-sm transition-all duration-500 ${isDark ? 'bg-[#0d0a1c]/90 border-white/5' : 'bg-white/95 border-pink-50'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-4">
            {location.pathname !== '/' && (
              <button onClick={() => navigate(-1)} className={`p-2 rounded-full hover:bg-slate-100 ${isDark ? 'text-white hover:bg-white/10' : 'text-slate-900'}`}>
                <ArrowLeft size={20} />
              </button>
            )}
            <Link to="/" className="flex items-center space-x-3">
              <span className={`text-2xl font-heading font-black tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>Sociafy</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <Link key={link.path} to={link.path} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${location.pathname === link.path ? 'text-pink-600' : isDark ? 'text-white/60 hover:text-pink-500' : 'text-slate-500 hover:text-pink-500'}`}>
                {link.name}
              </Link>
            ))}
            <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className={`text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-600'}`}>
              <MessageCircle size={14} /> Get Help
            </a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className={`relative p-3 rounded-2xl transition-all ${isDark ? 'text-white bg-white/10' : 'text-slate-900 bg-pink-50 hover:bg-pink-100'}`}>
              <ShoppingBag size={22} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className={`md:hidden p-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className={`md:hidden h-screen p-8 space-y-8 animate-in slide-in-from-top duration-300 ${isDark ? 'bg-[#0d0a1c] text-white' : 'bg-white'}`}>
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
const HomePage = () => (
  <div className="animate-in fade-in duration-700">
    <section className="pt-48 pb-24 px-6 lg:px-12 max-w-7xl mx-auto text-center">
      <div className="inline-block bg-pink-50 text-pink-500 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.4em] mb-12 border border-pink-100">
        Premium Growth Architecture
      </div>
      <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading font-black text-slate-900 leading-[0.9] tracking-tighter mb-12 uppercase">
        Skyrocket Your <br/>
        <span className="text-pink-500 italic">Brand Identity.</span>
      </h1>
      <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-16 font-medium leading-relaxed">
        <BanglaText>এখন আপনার পার্সোনাল আইডি বা বিজনেস পেজে লাইক, ফলোয়ার বা ভিউ নেওয়া একদম পানির মতো সহজ। ১০০% রিয়েল অথবা হাই-কোয়ালিটি বট — যা খুশি বেছে নিন।</BanglaText>
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-6">
        <Link to="/services" className="bg-slate-900 text-white px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-pink-600 shadow-xl transition-all">
          Explore Marketplace
        </Link>
        <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-pink-100 text-pink-600 px-12 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:bg-pink-50 transition-all flex items-center justify-center gap-3">
          <MessageCircle size={18} /> Order via WhatsApp
        </a>
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

// --- Single Marketplace Page ---
const MarketplacePage = () => {
  const { cart, addToCart, updateQuantity, removeFromCart, total, detailedSummaries, itemCount } = useCart();
  const navigate = useNavigate();

  const waOrderLink = useMemo(() => getWhatsAppOrderLink(cart, total), [cart, total]);

  return (
    <div className="pt-40 pb-32 bg-slate-50 px-6 lg:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        
        {/* Services List */}
        <div className="flex-grow space-y-12">
          <div className="mb-12">
            <h1 className="text-5xl md:text-6xl font-heading font-black uppercase text-slate-900 mb-4 tracking-tighter">Marketplace</h1>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                      <h3 className="text-2xl font-heading font-black text-slate-900 uppercase mb-2 leading-tight">{s.name}</h3>
                      <p className="text-xs text-slate-400 font-bold mb-6 min-h-[40px]"><BanglaText>{s.description}</BanglaText></p>
                      
                      <div className="flex flex-wrap items-center gap-4 mb-8">
                        <span className="text-3xl font-heading font-black text-pink-600">{s.price}৳</span>
                        <span className="text-[13px] font-black uppercase text-slate-900 tracking-wider border-2 border-slate-900 px-5 py-2.5 rounded-full bg-slate-50 shadow-[4px_4px_0_#F472B6] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
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
                          <span className="w-12 text-center font-heading font-black text-lg text-slate-900">{qty}</span>
                          <button 
                            onClick={() => addToCart(s)}
                            className="p-4 hover:bg-slate-200 transition-colors text-pink-600 active:scale-95"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        
                        {qty > 0 ? (
                          <div className="text-[10px] font-black text-pink-400 uppercase tracking-widest animate-in zoom-in duration-300">
                            <span className="text-slate-400">Total:</span> {(s.price * qty)}৳
                          </div>
                        ) : (
                          <button onClick={() => addToCart(s)} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-pink-500 transition-colors">
                            Add to cart
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desktop Sidebar Mini-Cart */}
        <aside className="hidden lg:flex w-full lg:w-[500px] flex-col">
          <div className="bg-gradient-to-br from-white to-pink-50 p-10 md:p-12 rounded-[60px] sticky top-32 shadow-[0_30px_100px_rgba(244,114,182,0.15)] border border-white overflow-hidden min-h-[600px] flex flex-col border-2">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/40 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            
            <div className="flex items-center justify-between mb-12 relative">
              <div>
                <h3 className="text-3xl font-heading font-black uppercase tracking-tight text-slate-900">Your Basket</h3>
                <p className="text-[12px] font-black text-pink-500 uppercase tracking-widest mt-1">Ready for settlement</p>
              </div>
              <div className="bg-pink-600 p-5 rounded-3xl text-white shadow-2xl shadow-pink-200">
                <ShoppingBag size={32} />
              </div>
            </div>

            <div className="flex-grow space-y-6 mb-12 overflow-y-auto max-h-[450px] pr-2 custom-scrollbar relative">
              {cart.length === 0 ? (
                <div className="text-center py-24 flex flex-col items-center opacity-40">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border border-pink-100">
                    <Trash2 size={28} className="text-pink-300" />
                  </div>
                  <p className="text-sm font-black uppercase tracking-widest text-slate-400">Your basket is empty</p>
                  <p className="text-[10px] mt-2 text-slate-300 font-bold uppercase">Select a growth package</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-[32px] border border-pink-100 group transition-all hover:bg-pink-100/30 hover:shadow-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-4">
                        <div className="bg-slate-50 p-3 rounded-xl shadow-sm border border-slate-100">
                           <PlatformIcon platform={item.platform} size={20} />
                        </div>
                        <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.name}</span>
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-red-500 transition-colors p-2"><X size={20}/></button>
                    </div>
                    <div className="flex justify-between items-center px-2">
                      <div className="flex items-center gap-3">
                         <span className="text-[11px] font-bold text-slate-400 uppercase">Quantity</span>
                         <span className="text-lg font-black text-pink-600 bg-white px-4 py-1.5 rounded-xl border border-pink-200 shadow-sm">{item.quantity}</span>
                      </div>
                      <span className="text-2xl font-heading font-black text-slate-900">{(item.price * item.quantity)}৳</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="mt-auto pt-8 border-t border-pink-100 space-y-8 relative">
                <div className="space-y-3 bg-white/60 p-6 rounded-3xl border border-white shadow-inner">
                   {detailedSummaries.map((summary) => (
                    <div key={summary.label} className="flex justify-between items-center text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">
                      <span>{summary.label}</span>
                      <span className="text-slate-900 font-black">{summary.value}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col gap-6">
                  <div className="flex justify-between items-end px-2">
                    <span className="text-xs font-black uppercase text-pink-400 tracking-[0.2em] mb-1">Total Payable</span>
                    <div className="text-7xl font-heading font-black text-slate-900 leading-none tracking-tighter">{total}৳</div>
                  </div>
                  
                  <button 
                    onClick={() => navigate('/cart')}
                    className="w-full bg-slate-900 hover:bg-pink-600 text-white py-8 rounded-[35px] font-black uppercase tracking-widest text-sm transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-4 group"
                  >
                    Confirm & Checkout <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
                
                {/* Smarter WhatsApp Link */}
                <div className="bg-green-50 p-6 rounded-3xl border border-green-100 text-center">
                   <p className="text-[10px] font-black text-green-700 uppercase tracking-widest mb-3">Prefer manual ordering?</p>
                   <a 
                     href={waOrderLink} 
                     target="_blank" 
                     rel="noopener noreferrer" 
                     className="flex items-center justify-center gap-2 text-xs font-black text-green-600 uppercase tracking-widest hover:text-green-800 transition-colors"
                   >
                     <MessageCircle size={16} /> Chat to Order Directly
                   </a>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
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

  if (cart.length === 0) return (
    <div className="pt-60 text-center min-h-screen px-6">
      <h2 className="text-4xl font-heading font-black uppercase text-slate-900 mb-6">Cart is Empty</h2>
      <Link to="/services" className="text-[10px] font-black uppercase tracking-widest text-pink-600 underline">Back to Marketplace</Link>
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
                  { label: 'Full Name *', name: 'name', icon: User },
                  { label: 'Mobile Number *', name: 'mobile', icon: Phone },
                  { label: 'WhatsApp *', name: 'whatsapp', icon: MessageCircle },
                  { label: 'Email *', name: 'email', icon: AtSign },
                  { label: 'Facebook Profile Link *', name: 'personalFbLink', icon: Link2 },
                  { label: 'Link to Boost (Page/Post) *', name: 'targetLink', icon: ArrowUpRight }
                ].map(f => (
                  <div key={f.name}>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                      <f.icon size={12}/> {f.label}
                    </label>
                    <input 
                      type="text" 
                      onChange={e => setOrderInfo({...orderInfo, [f.name as keyof OrderInfo]: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl focus:outline-none focus:border-pink-500 font-bold"
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
                    if (Object.values(orderInfo).every(v => v !== '')) {
                      localStorage.setItem('sociafy_pending_order_info', JSON.stringify(orderInfo));
                      navigate('/checkout');
                    } else {
                      alert('Please fill in all required fields marked with *');
                    }
                  }}
                  className="w-full bg-pink-600 py-6 rounded-3xl text-xl font-black uppercase tracking-widest hover:bg-pink-700 transition-all shadow-xl"
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

  const getThemeColor = () => method === 'bKash' ? '#D12053' : '#f97316';

  const handleSubmit = async () => {
    if (senderNumber.length < 11) {
      alert("সঠিক নম্বরটি দিন।");
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
         <h1 className="text-4xl font-heading font-black uppercase text-slate-900 mb-8">Order Confirmed!</h1>
         <p className="text-lg text-slate-500 font-medium mb-12"><BanglaText>আমরা খুব শীঘ্রই আপনার সাথে WhatsApp-এ যোগাযোগ করবো। ধন্যবাদ Sociafy-র সাথে থাকার জন্য।</BanglaText></p>
         <button onClick={() => navigate('/')} className="bg-pink-600 text-white px-12 py-5 rounded-full font-black uppercase tracking-widest">Return Home</button>
      </div>
    </div>
  );

  return (
    <div className="pt-40 pb-32 min-h-screen transition-colors duration-500 px-6 lg:px-12" style={{ backgroundColor: getThemeColor() + '10' }}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="flex-grow bg-white p-8 md:p-16 rounded-[60px] shadow-2xl border border-slate-100">
          <h1 className="text-5xl font-heading font-black uppercase text-slate-900 mb-12 tracking-tighter">Settlement</h1>
          <div className="flex gap-4 mb-16">
            <button onClick={() => setMethod('bKash')} className={`flex-1 py-8 rounded-3xl font-black uppercase tracking-widest text-xs transition-all ${method === 'bKash' ? 'bg-[#D12053] text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400'}`}>bKash</button>
            <button onClick={() => setMethod('Nagad')} className={`flex-1 py-8 rounded-3xl font-black uppercase tracking-widest text-xs transition-all ${method === 'Nagad' ? 'bg-[#f97316] text-white shadow-lg scale-105' : 'bg-slate-50 text-slate-400'}`}>Nagad</button>
          </div>
          <div className="bg-slate-50 p-10 rounded-[40px] mb-12 space-y-6">
            <div className="flex justify-between items-center text-xs font-black uppercase text-slate-400">
              <span>Pay to: 01846-119500 (Personal)</span>
              <span className="text-3xl font-heading font-black text-slate-900">{total}৳</span>
            </div>
            <div className="pt-8 border-t border-slate-200">
              <input type="text" placeholder="Your Sender Number (01XXXXXXXXX)" onChange={e => setSenderNumber(e.target.value)} className="w-full text-center bg-white border-2 border-slate-100 rounded-3xl p-6 text-2xl font-heading font-black focus:outline-none mb-8" style={{ borderColor: getThemeColor() + '40' }} />
              <button onClick={handleSubmit} disabled={isProcessing} className="w-full py-7 rounded-3xl text-xl font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95" style={{ backgroundColor: getThemeColor() }}>{isProcessing ? 'Verifying Transaction...' : 'Confirm Payment'}</button>
            </div>
          </div>
          
          <div className="bg-slate-50 p-10 rounded-[40px] border border-slate-100 text-center">
            <h4 className="text-lg font-heading font-black uppercase mb-4">Payment Issue?</h4>
            <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 bg-green-600 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-green-200">
              <MessageCircle size={18} /> Chat with Payment Team
            </a>
          </div>
        </div>

        <div className="w-full lg:w-96">
          <div className="bg-[#0f172a] text-white p-12 rounded-[60px] shadow-2xl">
            <h3 className="text-2xl font-heading font-black uppercase mb-8">Summary</h3>
            <div className="space-y-4 mb-12">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-start text-xs border-b border-white/5 pb-4">
                  <span className="text-pink-500 font-black uppercase">{item.name} x {item.quantity}</span>
                  <span className="font-black">{(item.price * item.quantity)}৳</span>
                </div>
              ))}
            </div>
            <div className="bg-white/5 p-6 rounded-3xl mb-12 space-y-2">
              {detailedSummaries.map((summary) => (
                <div key={summary.label} className="flex justify-between text-[10px] uppercase text-white/40">
                  <span>{summary.label}</span>
                  <span className="text-pink-500">{summary.value}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 font-bold uppercase text-xs">Total Amount</span>
              <span className="text-4xl font-heading font-black text-pink-500">{total}৳</span>
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
      <h1 className="text-6xl font-heading font-black uppercase text-slate-900 mb-20 text-center">Verified Success Stories</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {REVIEWS.map((r, i) => (
          <div key={i} className="bg-white p-12 rounded-[40px] border border-pink-50 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-pink-500 group-hover:w-4 transition-all"></div>
            <p className="text-2xl font-medium text-slate-600 italic mb-10 leading-relaxed font-heading">"{r.text}"</p>
            <div className="flex items-center gap-3 font-black uppercase text-[10px] tracking-widest text-pink-600">
               <div className="flex gap-1">
                 {[1,2,3,4,5].map(s => <Star key={s} size={10} fill="currentColor" />)}
               </div>
               <span>- {r.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// --- Sponsor Page ---
const SponsorPage = () => (
  <div className="min-h-screen text-white transition-colors duration-700 font-heading bg-[#0d0a1c]">
    <div className="w-full bg-blue-600 py-4 text-center text-[11px] font-black uppercase tracking-[0.5em] animate-pulse">OFFICIAL SPONSOR OF SOCIAFY DIGITAL</div>
    <section className="pt-56 pb-40 px-6 lg:px-12 max-w-7xl mx-auto text-center">
      <h1 className="text-7xl md:text-9xl font-black uppercase italic mb-12">CUSTOM<br/><span className="bg-gradient-to-r from-[#2563eb] to-[#2dd4bf] bg-clip-text text-transparent">WEBSITE.</span></h1>
      <p className="text-xl text-white/40 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">Fast, beautiful, custom code for elite businesses. No templates. Just growth.</p>
      <div className="flex justify-center gap-6">
        <a href="https://webrealmed.com/#/" target="_blank" className="bg-[#2563eb] text-white px-14 py-6 rounded-2xl font-black uppercase tracking-widest text-sm shadow-[0_20px_50px_rgba(37,211,102,0.3)] hover:scale-105 transition-all">Visit webrealmed.com</a>
      </div>
    </section>
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
            <Route path="/services" element={<MarketplacePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/web-service" element={<SponsorPage />} />
          </Routes>
        </main>
        
        <footer className="bg-white pt-24 pb-16 border-t border-slate-100 px-6 lg:px-12 text-center">
          <div className="max-w-7xl mx-auto">
            <span className="text-3xl font-heading font-black tracking-tighter text-slate-900 block mb-6">Sociafy</span>
            
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

        {/* Improved Floating WhatsApp Button with persistent label */}
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
