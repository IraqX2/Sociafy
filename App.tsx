
import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { HashRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingBag, 
  Menu, 
  X, 
  MessageCircle, 
  CheckCircle2, 
  ArrowLeft, 
  Trash2, 
  Facebook, 
  Instagram, 
  Youtube,
  ShieldCheck, 
  ArrowUpRight, 
  Check, 
  Phone, 
  User, 
  Plus,
  Minus,
  LayoutGrid,
  CreditCard,
  Zap,
  Star,
  Clock,
  Lock,
  Target,
  AlertCircle,
  Copy,
  ExternalLink
} from 'lucide-react';
import { CartItem, Service, OrderInfo, Platform } from './types';
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
  const clearCart = () => {
    setOrderCart([]);
    localStorage.removeItem('sociafy_cart');
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const detailedSummaries = useMemo(() => {
    const categories: Record<string, number> = {};
    cart.forEach(item => {
      let key = item.category.charAt(0).toUpperCase() + item.category.slice(1);
      categories[key] = (categories[key] || 0) + (item.unitValue * item.quantity);
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

  return (
    <nav className="fixed w-full z-[60] border-b shadow-sm backdrop-blur-sm transition-all duration-500 bg-white/95 border-pink-50">
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="flex justify-between h-16 md:h-20 items-center">
          <div className="flex items-center gap-2 md:gap-4">
            {location.pathname !== '/' && (
              <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-100 text-slate-900">
                <ArrowLeft size={18} />
              </button>
            )}
            <Link to="/" className="flex flex-col">
              <span className="text-xl md:text-2xl font-heading font-black tracking-tighter text-slate-900 leading-none">Sociafy</span>
              <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest mt-0.5">GROWTH ARCHITECT</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${location.pathname === '/' ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500'}`}>Home</Link>
            <Link to="/reviews" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${location.pathname === '/reviews' ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500'}`}>Reviews</Link>
            <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-green-600">
              <MessageCircle size={14} /> WhatsApp Support
            </a>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <Link to="/cart" className="relative p-2.5 md:p-3 rounded-xl md:rounded-2xl transition-all text-slate-900 bg-pink-50 hover:bg-pink-100">
              <ShoppingBag size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-pink-600 text-white text-[9px] md:text-[10px] font-black rounded-full flex items-center justify-center animate-in zoom-in">
                  {itemCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-slate-900">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden h-screen p-6 space-y-6 animate-in slide-in-from-top duration-300 bg-white text-slate-900 border-t">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-xl font-heading font-bold">Home</Link>
          <Link to="/reviews" onClick={() => setIsOpen(false)} className="block text-xl font-heading font-bold">Reviews</Link>
          <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 text-xl font-heading font-bold text-green-600">
            <MessageCircle size={24} /> WhatsApp Support
          </a>
        </div>
      )}
    </nav>
  );
};

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

const generateWhatsAppLink = (cart: CartItem[], orderInfo: OrderInfo, total: number) => {
  const itemsText = cart.map(i => `- ${i.name} (${i.quantity}x)`).join('\n');
  const message = `Assalamu Alaikum Sociafy,\nI want to place an order:\n\n*Order Details:*\n${itemsText}\n\n*Total:* ${total}৳\n\n*My Info:*\n- Name: ${orderInfo.name}\n- Mobile: ${orderInfo.mobile}\n- Email: ${orderInfo.email}\n- Link: ${orderInfo.targetLink}`;
  return `https://wa.me/8801846119500?text=${encodeURIComponent(message)}`;
};

// --- Home Page ---
const HomePage = () => {
  const { cart, addToCart, updateQuantity, itemCount, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="animate-in fade-in duration-700">
      <section className="pt-32 md:pt-48 pb-16 px-4 md:px-12 max-w-7xl mx-auto text-center">
        <div className="inline-block bg-pink-50 text-pink-500 px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] mb-8 border border-pink-100">
          Growth Architects since 2021
        </div>
        <h1 className="text-4xl md:text-8xl lg:text-9xl font-heading font-black text-slate-900 leading-[1.1] md:leading-[0.9] tracking-tighter mb-8 md:mb-12 uppercase">
          Skyrocket Your <br/>
          <span className="text-pink-500 italic">Brand Identity.</span>
        </h1>
        <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed px-2">
          <BanglaText>আইডি বা পেজে লাইক, ফলোয়ার বা ভিউ নেওয়া এখন পানির মতো সহজ। 100% রিয়েল অথবা হাই-কোয়ালিটি বট — যা খুশি বেছে নিন।</BanglaText>
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 px-4">
          <a href="#packages" className="bg-slate-900 text-white px-8 py-5 md:px-12 md:py-6 rounded-2xl md:rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-pink-600 shadow-xl transition-all">
            See All Packages
          </a>
          <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-pink-100 text-pink-600 px-8 py-5 md:px-12 md:py-6 rounded-2xl md:rounded-full font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-pink-50 transition-all flex items-center justify-center gap-2">
            <MessageCircle size={16} /> WhatsApp directly
          </a>
        </div>
      </section>

      <section id="packages" className="py-16 md:py-24 bg-slate-50 px-4 md:px-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-3xl md:text-6xl font-heading font-black uppercase text-slate-900 mb-2 tracking-tighter">Choose Your Package</h2>
            <p className="text-sm md:text-lg text-slate-400 font-medium"><BanglaText>সেরা গ্রোথ মেথড গুলো এখানে।</BanglaText></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
            {SERVICES.map((s) => {
              const item = cart.find(c => c.serviceId === s.id);
              const qty = item?.quantity || 0;

              return (
                <div 
                  key={s.id} 
                  className={`group relative rounded-[40px] border transition-all duration-500 p-6 md:p-10 flex flex-col gap-6 overflow-hidden ${qty > 0 ? 'bg-white border-pink-500 ring-4 ring-pink-500/10 shadow-[0_30px_60px_rgba(244,114,182,0.2)] scale-[1.04] z-10' : 'bg-slate-100 border-slate-200 hover:bg-white hover:border-slate-300 hover:shadow-2xl hover:scale-[1.02]'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-24 md:w-32 aspect-square rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-md transition-transform group-hover:scale-105 duration-500">
                      <img src={s.imageUrl} className="w-full h-full object-cover" alt={s.name} />
                    </div>
                    <div className={`p-3 rounded-2xl shadow-sm border backdrop-blur-md ${qty > 0 ? 'bg-pink-50 border-pink-500' : 'bg-white border-slate-200'}`}>
                      <PlatformIcon platform={s.platform} size={24} className={qty > 0 ? 'text-pink-500' : 'text-slate-400'} />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-xl md:text-2xl font-heading font-black text-slate-900 uppercase mb-2 leading-tight tracking-tight">{s.name}</h3>
                      <p className="text-[11px] md:text-xs text-slate-500 font-bold mb-6 md:mb-8 leading-relaxed">
                        <BanglaText>{s.description}</BanglaText>
                      </p>
                      
                      <div className="flex items-center gap-4 mb-8 md:mb-10">
                        <div className={`px-4 py-2 rounded-xl font-heading font-black text-2xl md:text-3xl shadow-sm transition-colors ${qty > 0 ? 'bg-pink-500 text-white' : 'bg-white text-slate-900 border border-slate-200'}`}>
                          {s.price}৳
                        </div>
                        <span className="text-[10px] md:text-[11px] font-black uppercase text-slate-400 tracking-wider bg-white/50 px-4 py-2 rounded-full border border-slate-200">
                          {s.unitValue} {s.unitLabel}
                        </span>
                      </div>
                    </div>

                    <div className={`flex items-center justify-between mt-auto pt-6 border-t ${qty > 0 ? 'border-pink-50' : 'border-slate-200'}`}>
                        <div className={`flex items-center rounded-2xl overflow-hidden transition-all duration-300 ${qty > 0 ? 'bg-pink-100' : 'bg-white border border-slate-200'}`}>
                          <button onClick={() => item && updateQuantity(item.id, qty - 1)} className="p-4 hover:bg-slate-50 transition-colors text-slate-400"><Minus size={16} /></button>
                          <span className={`w-10 text-center font-heading font-black text-xl ${qty > 0 ? 'text-pink-600' : 'text-slate-900'}`}>{qty}</span>
                          <button onClick={() => addToCart(s)} className="p-4 hover:bg-slate-50 transition-colors text-pink-600"><Plus size={16} /></button>
                        </div>
                        
                        {qty > 0 && (
                          <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest animate-in zoom-in slide-in-from-right-2">
                             {(s.price * qty)}৳ TOTAL
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Process Sections */}
      <section className="py-24 px-4 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
           <div className="flex flex-col items-center text-center p-10 bg-slate-50 rounded-[50px] border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Clock size={32}/></div>
              <h4 className="text-xl font-heading font-black uppercase mb-3 text-slate-900">Fast Delivery</h4>
              <p className="text-xs text-slate-400 font-bold leading-relaxed"><BanglaText>আমাদের মেথড গুলো খুবই দ্রুত কাজ করে। সাধারণত ২-২৪ ঘন্টার মধ্যেই সার্ভিস শুরু হয়ে যায়।</BanglaText></p>
           </div>
           <div className="flex flex-col items-center text-center p-10 bg-slate-50 rounded-[50px] border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Lock size={32}/></div>
              <h4 className="text-xl font-heading font-black uppercase mb-3 text-slate-900">Safe & Secure</h4>
              <p className="text-xs text-slate-400 font-bold leading-relaxed"><BanglaText>আমরা কখনো আপনার পাসওয়ার্ড চাই না। শুধু লিঙ্ক দিলেই সার্ভিস ডেলিভারি সম্ভব। আইডি থাকবে নিরাপদ।</BanglaText></p>
           </div>
           <div className="flex flex-col items-center text-center p-10 bg-slate-50 rounded-[50px] border border-slate-100 hover:shadow-xl transition-all group">
              <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Target size={32}/></div>
              <h4 className="text-xl font-heading font-black uppercase mb-3 text-slate-900">Real Engagement</h4>
              <p className="text-xs text-slate-400 font-bold leading-relaxed"><BanglaText>BD রিয়েল ফলোয়ার ও রিয়েল লাইক দিয়ে আপনার পেজের অর্গানিক রিচ বাড়ানোর সেরা সমাধান।</BanglaText></p>
           </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white px-4 md:px-12 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-6xl font-heading font-black uppercase tracking-tighter mb-4">How it Works?</h2>
            <p className="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-pink-500">Simple 3-Step Process</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
               { step: '01', title: 'Choose Package', desc: 'পছন্দমতো সার্ভিস কার্টে যোগ করুন।' },
               { step: '02', title: 'Online Payment', desc: 'বিকাশ বা নগদে নিরাপদে পেমেন্ট সম্পন্ন করুন।' },
               { step: '03', title: 'Boom!', desc: 'ব্যাস! আপনার অর্ডারটি অটোমেটিকলি প্রসেসিং শুরু হবে।' }
             ].map((item, idx) => (
               <div key={idx} className="relative group">
                  <div className="absolute -top-10 -left-6 text-9xl font-heading font-black text-white/5 group-hover:text-pink-500/10 transition-colors">{item.step}</div>
                  <div className="bg-white/5 p-10 rounded-[50px] border border-white/10 hover:border-pink-500/30 transition-all">
                     <h4 className="text-2xl font-heading font-black mb-4 uppercase">{item.title}</h4>
                     <p className="text-white/40 font-bold"><BanglaText>{item.desc}</BanglaText></p>
                  </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {itemCount > 0 && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-[90] bg-slate-900 text-white p-5 rounded-3xl shadow-2xl flex items-center justify-between border border-white/10 animate-in slide-in-from-bottom">
           <div className="flex items-center gap-4">
             <div className="bg-pink-600 p-3 rounded-2xl"><ShoppingBag size={20} className="text-white" /></div>
             <div>
               <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Total Amount</p>
               <p className="text-2xl font-heading font-black text-pink-500 leading-none">{total}৳</p>
             </div>
           </div>
           <button onClick={() => navigate('/cart')} className="bg-pink-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all shadow-lg">Proceed</button>
        </div>
      )}
    </div>
  );
};

// --- Cart Page ---
const CartPage = () => {
  const { cart, removeFromCart, total, detailedSummaries, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [orderInfo, setOrderInfo] = useState<OrderInfo>({
    name: '', mobile: '', whatsapp: '', personalFbLink: '', targetLink: '', description: '', email: ''
  });

  if (cart.length === 0) return (
    <div className="pt-48 text-center min-h-screen px-4">
      <h2 className="text-3xl font-heading font-black uppercase text-slate-900 mb-4 tracking-tight">Cart is Empty</h2>
      <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-pink-600 underline">Start Growth Journey</Link>
    </div>
  );

  return (
    <div className="pt-24 md:pt-40 pb-32 bg-slate-50 px-4 md:px-12 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-6xl font-heading font-black uppercase text-slate-900 mb-8 md:mb-20 tracking-tighter">My Selection</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-6 md:p-12 rounded-[50px] shadow-sm border border-slate-100">
               {cart.map(item => (
                 <div key={item.id} className="flex justify-between items-center py-6 border-b border-slate-50 last:border-0">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-lg font-heading font-black uppercase text-slate-900">{item.name}</h4>
                      <div className="flex items-center bg-slate-50 rounded-lg px-2 py-1 w-fit border border-slate-100">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-400 p-1"><Minus size={12}/></button>
                        <span className="mx-3 font-heading font-black text-slate-900 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-400 p-1"><Plus size={12}/></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <span className="text-xl font-heading font-bold">{(item.price * item.quantity)}৳</span>
                       <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                 </div>
               ))}
               <div className="pt-8 flex justify-between items-center font-heading font-black text-slate-900 text-3xl">
                  <span>Grand Total</span>
                  <span className="text-pink-600">{total}৳</span>
               </div>
            </div>

            <div className="bg-white p-6 md:p-12 rounded-[50px] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-heading font-black uppercase mb-12 tracking-tight">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: 'Full Name *', name: 'name', icon: User, placeholder: 'e.g. Nayeem Uddin', required: true },
                  { label: 'Mobile Number *', name: 'mobile', icon: Phone, placeholder: '018XXXXXXXX', required: true },
                  { label: 'Customer Email *', name: 'email', icon: Star, placeholder: 'name@example.com', required: true },
                  { label: 'WhatsApp Number', name: 'whatsapp', icon: MessageCircle, placeholder: '018XXXXXXXX', required: false },
                  { label: 'Link to Personal ID', name: 'personalFbLink', icon: Facebook, placeholder: 'fb.com/nayeem', required: false },
                  { label: 'Link to Promote *', name: 'targetLink', icon: ArrowUpRight, placeholder: 'fb.com/page/post', required: true }
                ].map(f => (
                  <div key={f.name}>
                    <label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4"><f.icon size={12}/> {f.label}</label>
                    <input 
                      type="text" 
                      placeholder={f.placeholder}
                      required={f.required}
                      onChange={e => setOrderInfo({...orderInfo, [f.name]: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-6 rounded-2xl focus:outline-none focus:border-pink-500 font-bold"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
             <div className="bg-slate-900 text-white p-12 rounded-[60px] shadow-2xl sticky top-24 space-y-6">
                <h3 className="text-2xl font-heading font-black uppercase mb-10">Payable</h3>
                <div className="bg-white/5 p-8 rounded-[40px] mb-12 space-y-4">
                  {detailedSummaries.map((summary) => (
                    <div key={summary.label} className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>{summary.label}</span>
                      <span className="text-pink-500 text-lg">{summary.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center mb-12">
                  <span className="text-xl font-bold uppercase text-white/60">Total</span>
                  <span className="text-5xl font-heading font-black text-pink-500">{total}৳</span>
                </div>
                <button 
                  onClick={() => {
                    if (orderInfo.name && orderInfo.mobile && orderInfo.targetLink && orderInfo.email) {
                      localStorage.setItem('sociafy_pending_order_info', JSON.stringify(orderInfo));
                      navigate('/payment');
                    } else { alert('Please fill required fields marked with *'); }
                  }}
                  className="w-full bg-pink-600 py-6 rounded-3xl text-xl font-black uppercase tracking-widest hover:bg-pink-700 transition-all active:scale-95 text-white"
                >
                  Confirm Order
                </button>
                <a href={generateWhatsAppLink(cart, orderInfo, total)} target="_blank" rel="noopener noreferrer" className="w-full bg-green-600 py-6 rounded-3xl text-xl font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-3">
                  <MessageCircle size={24} /> Pay in WhatsApp
                </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Payment Page ---
const PaymentPage = () => {
  const { total, clearCart, cart } = useCart();
  const navigate = useNavigate();
  const [senderNumber, setSenderNumber] = useState('');
  const [method, setMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [finalTotal, setFinalTotal] = useState<number>(0);

  const paymentNumber = '01846119500';

  const handleSubmit = async () => {
    const cleaned = senderNumber.replace(/\D/g, ''); 
    if (cleaned.length < 11) {
      alert("Please enter a valid 11-digit number.");
      return;
    }
    
    setIsProcessing(true);
    const orderInfo = JSON.parse(localStorage.getItem('sociafy_pending_order_info') || '{}');
    
    const isDevelopment = 
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' || 
      window.location.hostname.startsWith('192.168.') || 
      window.location.hostname.includes('web-preview');

    if (isDevelopment) {
      setTimeout(() => {
        const simulatedId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
        setFinalTotal(total); // Save total before clearing
        setOrderSuccess(simulatedId);
        clearCart();
        setIsProcessing(false);
      }, 1500);
      return;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); 

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderInfo, cart, total, paymentDetails: { method, senderNumber: cleaned } }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error("Backend not reached");
      
      const result = await response.json();
      if (result.success) {
        setFinalTotal(total); // Save total before clearing
        setOrderSuccess(result.orderId);
        clearCart();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error("Payment Submission Error:", error);
      alert("Automated verification failed. PLEASE USE THE WHATSAPP BUTTON to send your screenshot manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  // SUCCESS PAGE (Last Page)
  if (orderSuccess) return (
    <div className="pt-24 md:pt-40 pb-40 min-h-screen bg-slate-50 flex flex-col items-center px-4 animate-in fade-in duration-500">
      <div className="max-w-2xl w-full bg-white p-10 md:p-20 rounded-[60px] shadow-2xl border border-pink-100 text-center relative overflow-hidden">
         {/* Decoration */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
         
         <div className="relative mb-12">
            <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto ring-8 ring-green-100 animate-pulse">
               <CheckCircle2 size={56} strokeWidth={1.5} />
            </div>
         </div>

         <h1 className="text-4xl md:text-5xl font-heading font-black uppercase text-slate-900 mb-4 tracking-tighter">Order Received</h1>
         <div className="inline-block bg-pink-50 px-6 py-2 rounded-full border border-pink-100 mb-10">
            <span className="text-pink-600 font-black uppercase text-xs tracking-[0.2em]">{orderSuccess}</span>
         </div>
         
         <div className="mb-12 space-y-6 text-left bg-slate-50 p-8 rounded-[40px] border border-slate-100">
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Verification Status</span>
               <span className="text-[10px] font-black uppercase text-orange-500 flex items-center gap-1"><Clock size={12}/> Pending</span>
            </div>
            <div className="flex justify-between items-center border-b border-slate-200 pb-4">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Amount to Pay</span>
               <span className="text-xl font-heading font-black text-slate-900">{finalTotal}৳</span>
            </div>
            <div className="text-center pt-2">
               <p className="text-sm font-medium text-slate-500 leading-relaxed"><BanglaText>আমরা আপনার পেমেন্ট ভেরিফাই করছি। সাধারণত ৩০ মিনিটের মধ্যে আপনার সার্ভিসটি শুরু হয়ে যাবে। কনফার্মেশন এর জন্য ইমেইল চেক করুন।</BanglaText></p>
            </div>
         </div>

         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white py-6 rounded-3xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 shadow-xl hover:scale-[1.02] transition-all">
              <MessageCircle size={20} /> Get Update
            </a>
            <button onClick={() => navigate('/')} className="bg-slate-900 text-white py-6 rounded-3xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-800 transition-all">
               Back to Home
            </button>
         </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 md:pt-40 pb-32 min-h-screen px-4 md:px-12 bg-slate-50">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-heading font-black uppercase text-slate-900 mb-2 tracking-tighter">Payment</h1>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Secure Verification</p>
        </div>
        <div className="space-y-6">
          <div className="flex gap-3">
            <button onClick={() => setMethod('bKash')} className={`flex-1 py-5 rounded-2xl font-black uppercase text-[10px] transition-all ${method === 'bKash' ? 'bg-[#D12053] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>bKash</button>
            <button onClick={() => setMethod('Nagad')} className={`flex-1 py-5 rounded-2xl font-black uppercase text-[10px] transition-all ${method === 'Nagad' ? 'bg-[#f97316] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>Nagad</button>
          </div>
          <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
               <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0">1</div>
                  <p className="text-sm font-bold text-slate-900 leading-tight"><BanglaText>এই নম্বরে "{total}৳" সেন্ড মানি করুন (পার্সোনাল)</BanglaText></p>
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Target Number (Copy)</p>
                  <button onClick={() => { navigator.clipboard.writeText(paymentNumber); alert('Copied!'); }} className="w-full flex items-center justify-between bg-slate-50 px-6 py-5 rounded-2xl font-heading font-black text-slate-900 text-xl border border-slate-100 transition-all hover:bg-slate-100 active:scale-[0.98]">
                    <span>{paymentNumber}</span>
                    <Copy size={18} className="text-pink-500" />
                  </button>
               </div>
               <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Your {method} Number</p>
                  <input type="text" placeholder="01XXXXXXXXX" value={senderNumber} onChange={e => setSenderNumber(e.target.value)} className="w-full bg-white border-2 border-slate-100 px-6 py-5 rounded-2xl font-heading font-black text-center focus:outline-none focus:border-pink-500" />
               </div>
               <div className="flex flex-col gap-4">
                  <button onClick={handleSubmit} disabled={isProcessing} className={`w-full py-6 rounded-3xl text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all ${method === 'bKash' ? 'bg-[#D12053]' : 'bg-[#f97316]'} ${isProcessing ? 'opacity-50 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`}>
                    {isProcessing ? 'PROCESSING...' : 'Submit Verification'}
                  </button>
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest text-slate-300 bg-white px-4">Or Manual</div>
                  </div>
                  <a href={generateWhatsAppLink(cart, JSON.parse(localStorage.getItem('sociafy_pending_order_info') || '{}'), total)} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white w-full py-6 rounded-3xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-green-700 hover:scale-[1.02] transition-all">
                    <MessageCircle size={16} /> Pay via WhatsApp directly
                  </a>
               </div>
          </div>
          <div className="flex items-center gap-3 bg-blue-50 p-6 rounded-3xl border border-blue-100">
             <AlertCircle className="text-blue-500 shrink-0" size={20} />
             <p className="text-[10px] text-blue-700 font-bold leading-relaxed"><BanglaText>পেমেন্ট সাবমিট করার পর আমাদের সাপোর্ট টিমের মেম্বার সেটি চেক করে অর্ডারটি কনফার্ম করবে।</BanglaText></p>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App ---
const App = () => {
  const location = useLocation();
  const { itemCount } = useCart();
  
  const isHomePage = location.pathname === '/';
  const waBottomClass = (isHomePage && itemCount > 0) ? 'bottom-44' : 'bottom-6';

  return (
    <div className="min-h-screen flex flex-col selection:bg-pink-500 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
        </Routes>
      </main>
      <footer className="bg-white pt-24 pb-12 border-t border-slate-100 px-4 md:px-12 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <span className="text-2xl font-heading font-black tracking-tighter text-slate-900 block mb-1">Sociafy</span>
            <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Growth Architecture since 2021</span>
          </div>
          <div className="flex flex-col items-center gap-10">
             <div className="flex gap-12 text-slate-300">
                <a href={SOCIAFY_INFO.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-[#1877F2] transition-colors"><Facebook size={24} /></a>
                <a href={SOCIAFY_INFO.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-[#E4405F] transition-colors"><Instagram size={24} /></a>
                <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-green-600 transition-colors"><MessageCircle size={24} /></a>
             </div>
             <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">© {new Date().getFullYear()} Sociafy Digital. All Rights Reserved.</div>
          </div>
        </div>
      </footer>
      
      <a 
        href={SOCIAFY_INFO.whatsapp} 
        target="_blank" 
        rel="noopener noreferrer" 
        className={`fixed ${waBottomClass} md:bottom-8 right-6 md:right-8 z-[110] flex items-center gap-2 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_40px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300 group active:scale-95`}
      >
        <MessageCircle size={28} />
        <span className="hidden md:block font-heading font-black uppercase text-[11px] tracking-widest px-2">WhatsApp Support</span>
      </a>
    </div>
  );
};

const AppWrapper = () => (
  <CartProvider>
    <Router>
      <App />
    </Router>
  </CartProvider>
);

const ReviewsPage = () => (
  <div className="pt-24 md:pt-40 pb-32 bg-slate-50 px-4 md:px-12 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-7xl font-heading font-black uppercase text-slate-900 mb-4 tracking-tighter">Reviews</h1>
        <p className="text-pink-500 font-black uppercase tracking-[0.3em] text-[10px]">What Our Clients Say</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {REVIEWS.map((r, i) => (
          <div key={i} className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-sm flex flex-col hover:shadow-2xl hover:border-pink-100 transition-all group">
            <div className="flex gap-1 mb-8">{[1,2,3,4,5].map(s => <Star key={s} size={14} className="text-pink-500" fill="currentColor" />)}</div>
            <p className="text-lg font-medium text-slate-600 italic mb-10 leading-relaxed font-heading">"{r.text}"</p>
            <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                <div className="flex flex-col">
                  <span className="font-heading font-black uppercase text-slate-900 tracking-tight leading-none">{r.name}</span>
                  <span className="text-[8px] font-black text-green-500 uppercase tracking-widest mt-1">Verified Purchase</span>
                </div>
                <div className="bg-green-100 text-green-600 p-1.5 rounded-full"><CheckCircle2 size={14} /></div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Missing Reviews CTA */}
      <div className="text-center">
         <a 
           href={SOCIAFY_INFO.reviewsUrl} 
           target="_blank" 
           rel="noopener noreferrer" 
           className="bg-white border-2 border-slate-200 text-slate-900 px-10 py-5 rounded-3xl font-black uppercase text-xs tracking-widest hover:border-pink-500 hover:text-pink-500 transition-all inline-flex items-center gap-3 shadow-sm hover:shadow-xl"
         >
           <Facebook size={18} /> View All Reviews on Facebook
         </a>
      </div>
    </div>
  </div>
);

export default AppWrapper;
