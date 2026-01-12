
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
  Star
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
    <nav className="fixed w-full z-50 border-b shadow-sm backdrop-blur-sm transition-all duration-500 bg-white/95 border-pink-50">
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
              <span className="text-[8px] font-black text-pink-500 uppercase tracking-widest mt-0.5">EST. 2021</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${location.pathname === '/' ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500'}`}>Home</Link>
            <Link to="/reviews" className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ${location.pathname === '/reviews' ? 'text-pink-600' : 'text-slate-500 hover:text-pink-500'}`}>Reviews</Link>
            <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 text-green-600">
              <MessageCircle size={14} /> WhatsApp Directly
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
            <MessageCircle size={24} /> WhatsApp Directly
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
    case 'tiktok': return <div className="text-black font-black italic tracking-tighter" style={{fontSize: size*0.8}}>T</div>;
    default: return <LayoutGrid className={`text-slate-400 ${className}`} size={size} />;
  }
};

// --- Helper for WhatsApp link generation ---
const generateWhatsAppLink = (cart: CartItem[], orderInfo: OrderInfo, total: number) => {
  const itemsText = cart.map(i => `- ${i.name} (${i.quantity}x)`).join('\n');
  const message = `Assalamu Alaikum Sociafy,\nI want to place an order:\n\n*Order Details:*\n${itemsText}\n\n*Total:* ${total}৳\n\n*My Info:*\n- Name: ${orderInfo.name}\n- Mobile: ${orderInfo.mobile}\n- Email: ${orderInfo.email}\n- Target: ${orderInfo.targetLink}`;
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
          Growth Since 2021
        </div>
        <h1 className="text-4xl md:text-8xl lg:text-9xl font-heading font-black text-slate-900 leading-[1.1] md:leading-[0.9] tracking-tighter mb-8 md:mb-12 uppercase">
          Skyrocket Your <br/>
          <span className="text-pink-500 italic">Brand Identity.</span>
        </h1>
        <p className="text-base md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 md:mb-16 font-medium leading-relaxed px-2">
          <BanglaText>আইডি বা পেজে লাইক, ফলোয়ার বা ভিউ নেওয়া এখন পানির মতো সহজ। ১০০% রিয়েল অথবা হাই-কোয়ালিটি বট — যা খুশি বেছে নিন।</BanglaText>
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
            <h2 className="text-3xl md:text-6xl font-heading font-black uppercase text-slate-900 mb-2 tracking-tighter">Choose Your Growth</h2>
            <p className="text-sm md:text-lg text-slate-400 font-medium"><BanglaText>সেরা গ্রোথ মেথড গুলো এখানে।</BanglaText></p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {SERVICES.map((s) => {
              const item = cart.find(c => c.serviceId === s.id);
              const qty = item?.quantity || 0;

              return (
                <div 
                  key={s.id} 
                  className={`bg-white rounded-3xl md:rounded-[40px] border transition-all duration-300 p-5 md:p-8 flex flex-col gap-4 md:gap-6 group ${qty > 0 ? 'border-pink-500 ring-4 ring-pink-500/10 shadow-[0_15px_40px_rgba(244,114,182,0.15)] scale-[1.03]' : 'border-slate-100 hover:shadow-xl'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-20 md:w-1/3 aspect-square rounded-2xl overflow-hidden bg-slate-50 border border-slate-100">
                      <img src={s.imageUrl} className="w-full h-full object-cover" alt={s.name} />
                    </div>
                    <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl shadow-sm border ${qty > 0 ? 'bg-pink-50 border-pink-200' : 'bg-slate-50 border-slate-100'}`}>
                      <PlatformIcon platform={s.platform} size={20} />
                    </div>
                  </div>

                  <div className="flex flex-col justify-between flex-grow">
                    <div>
                      <h3 className="text-lg md:text-xl font-heading font-black text-slate-900 uppercase mb-1 leading-tight">{s.name}</h3>
                      <p className="text-[10px] md:text-xs text-slate-400 font-bold mb-4 md:mb-6"><BanglaText>{s.description}</BanglaText></p>
                      
                      <div className="flex items-center gap-3 mb-6 md:mb-8">
                        <span className={`text-2xl md:text-3xl font-heading font-black ${qty > 0 ? 'text-pink-600' : 'text-slate-900'}`}>{s.price}৳</span>
                        <span className="text-[9px] md:text-[11px] font-black uppercase text-slate-900 tracking-wider bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                          Per {s.unitValue} {s.unitLabel}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className={`flex items-center rounded-xl overflow-hidden transition-colors ${qty > 0 ? 'bg-pink-100' : 'bg-slate-100'}`}>
                          <button 
                            onClick={() => item && updateQuantity(item.id, qty - 1)}
                            className="p-3 md:p-4 hover:bg-slate-200 transition-colors text-slate-600"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 md:w-10 text-center font-heading font-black text-base md:text-lg text-slate-900">{qty}</span>
                          <button 
                            onClick={() => addToCart(s)}
                            className="p-3 md:p-4 hover:bg-slate-200 transition-colors text-pink-600"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        
                        {qty > 0 && (
                          <div className="text-[9px] font-black text-pink-500 uppercase tracking-widest animate-in zoom-in">
                            {(s.price * qty)}৳ Total
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

      {itemCount > 0 && (
        <div className="md:hidden fixed bottom-6 left-4 right-4 z-40 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 animate-in slide-in-from-bottom duration-500">
           <div className="flex items-center gap-3">
             <div className="bg-pink-600 p-2 rounded-lg"><ShoppingBag size={18} /></div>
             <div>
               <p className="text-[8px] font-black uppercase tracking-widest text-white/40">Total Pay</p>
               <p className="text-xl font-heading font-black text-pink-500 leading-none">{total}৳</p>
             </div>
           </div>
           <button onClick={() => navigate('/cart')} className="bg-pink-600 text-white px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Proceed</button>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-16">
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <div className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[50px] shadow-sm border border-slate-100">
               {cart.map(item => (
                 <div key={item.id} className="flex justify-between items-center py-4 md:py-8 border-b border-slate-50 last:border-0">
                    <div className="flex flex-col gap-2 md:gap-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <PlatformIcon platform={item.platform} size={14} />
                        <h4 className="text-sm md:text-xl font-heading font-black uppercase text-slate-900 leading-tight">{item.name}</h4>
                      </div>
                      <div className="flex items-center bg-slate-50 rounded-lg px-2 py-1 border border-slate-100 w-fit">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-slate-400 p-1"><Minus size={12}/></button>
                        <span className="mx-3 font-heading font-black text-slate-900 text-xs md:text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-slate-400 p-1"><Plus size={12}/></button>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:gap-12">
                       <span className="text-base md:text-2xl font-heading font-bold">{(item.price * item.quantity)}৳</span>
                       <button onClick={() => removeFromCart(item.id)} className="text-slate-200 hover:text-red-500"><Trash2 size={18}/></button>
                    </div>
                 </div>
               ))}
               <div className="pt-6 md:pt-8 flex justify-between items-center font-heading font-black text-slate-900 text-xl md:text-3xl">
                  <span>Grand Total</span>
                  <span className="text-pink-600">{total}৳</span>
               </div>
            </div>

            <div className="bg-white p-6 md:p-12 rounded-3xl md:rounded-[50px] shadow-sm border border-slate-100">
              <h3 className="text-lg md:text-2xl font-heading font-black uppercase mb-6 md:mb-12 tracking-tight">Order Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {[
                  { label: 'Full Name *', name: 'name', icon: User, placeholder: 'e.g. Nayeem Uddin', required: true },
                  { label: 'Mobile Number *', name: 'mobile', icon: Phone, placeholder: '018XXXXXXXX', required: true },
                  { label: 'Customer Email *', name: 'email', icon: Star, placeholder: 'name@example.com', required: true },
                  { label: 'WhatsApp Number', name: 'whatsapp', icon: MessageCircle, placeholder: '018XXXXXXXX', required: false },
                  { label: 'Link to Personal ID', name: 'personalFbLink', icon: Facebook, placeholder: 'fb.com/profile.php?id=...', required: false },
                  { label: 'Link to Promote *', name: 'targetLink', icon: ArrowUpRight, placeholder: 'fb.com/page/post', required: true }
                ].map(f => (
                  <div key={f.name}>
                    <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 md:mb-4">
                      <f.icon size={12}/> {f.label}
                    </label>
                    <input 
                      type={f.name === 'email' ? 'email' : 'text'}
                      placeholder={f.placeholder}
                      required={f.required}
                      onChange={e => setOrderInfo({...orderInfo, [f.name]: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-100 p-4 md:p-6 rounded-xl md:rounded-2xl focus:outline-none focus:border-pink-500 font-bold text-sm md:text-base"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
             <div className="bg-[#0f172a] text-white p-8 md:p-12 rounded-3xl md:rounded-[60px] shadow-2xl sticky top-24 space-y-4">
                <h3 className="text-xl md:text-3xl font-heading font-black uppercase mb-6 md:mb-12">Summary</h3>
                <div className="bg-white/5 p-4 md:p-8 rounded-2xl md:rounded-[40px] mb-8 md:mb-12 space-y-3">
                  {detailedSummaries.map((summary) => (
                    <div key={summary.label} className="flex justify-between items-center text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/40">
                      <span>{summary.label}</span>
                      <span className="text-pink-500 text-sm">{summary.value}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-white/10 flex justify-between items-center mb-8 md:mb-12">
                  <span className="text-sm md:text-xl font-bold uppercase text-white/60">Payable</span>
                  <span className="text-3xl md:text-5xl font-heading font-black text-pink-500">{total}৳</span>
                </div>
                
                <button 
                  onClick={() => {
                    const { name, mobile, targetLink, email } = orderInfo;
                    if (name.trim() && mobile.trim() && targetLink.trim() && email.trim()) {
                      localStorage.setItem('sociafy_pending_order_info', JSON.stringify(orderInfo));
                      navigate('/payment');
                    } else {
                      alert('প্লিজ সব প্রয়োজনীয় তথ্য সঠিকভাবে দিন (Full Name, Mobile, Email, and Link are required)');
                    }
                  }}
                  className="w-full bg-pink-600 py-4 md:py-6 rounded-2xl md:rounded-3xl text-sm md:text-lg font-black uppercase tracking-widest hover:bg-pink-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Confirm & Pay Online
                </button>

                <a 
                  href={generateWhatsAppLink(cart, orderInfo, total)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-600 py-4 md:py-6 rounded-2xl md:rounded-3xl text-sm md:text-lg font-black uppercase tracking-widest hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} /> Order & Pay in WhatsApp
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

  const paymentNumber = '01846119500';

  const handleSubmit = async () => {
    const cleanedNumber = senderNumber.replace(/\D/g, ''); 
    if (cleanedNumber.length < 11) {
      alert("পেমেন্ট সম্পন্ন করার নম্বরটি দিন (১১ ডিজিট)।");
      return;
    }
    
    setIsProcessing(true);
    const orderInfoRaw = localStorage.getItem('sociafy_pending_order_info');
    const orderInfo = orderInfoRaw ? JSON.parse(orderInfoRaw) : {};
    
    try {
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderInfo,
          cart,
          total,
          paymentDetails: {
            method,
            senderNumber: cleanedNumber
          }
        })
      });

      if (!response.ok) throw new Error("Server error");
      const result = await response.json();

      if (result.success) {
        setOrderSuccess(result.orderId);
        clearCart();
        localStorage.removeItem('sociafy_pending_order_info');
      } else {
        alert("অর্ডার সাবমিট করতে সমস্যা হয়েছে। দয়া করে হোয়াটসঅ্যাপে আমাদের জানান।");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন অথবা সরাসরি হোয়াটসঅ্যাপে পেমেন্ট করুন।");
    } finally {
      setIsProcessing(false);
    }
  };

  if (orderSuccess) return (
    <div className="pt-32 pb-32 min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-xl w-full bg-white p-8 md:p-16 rounded-[40px] md:rounded-[60px] shadow-2xl border border-pink-100 text-center animate-in zoom-in">
         <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
         </div>
         <h1 className="text-2xl md:text-4xl font-heading font-black uppercase text-slate-900 mb-2 tracking-tight">Order Placed!</h1>
         <p className="text-pink-600 font-black mb-4 uppercase text-xs tracking-widest">Order ID: {orderSuccess}</p>
         <div className="mb-10 text-slate-600 font-medium px-4">
            <BanglaText>আপনার অর্ডারটি সাবমিট হয়েছে। আমরা ইমেইলের মাধ্যমে আপনাকে কনফার্মেশন পাঠিয়েছি।</BanglaText>
         </div>
         <div className="flex flex-col gap-3">
            <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white w-full py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl">
              <MessageCircle size={20} /> WhatsApp Support
            </a>
            <button onClick={() => navigate('/')} className="text-slate-400 font-black uppercase tracking-widest text-[9px] py-4">Return Home</button>
         </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 md:pt-40 pb-32 min-h-screen px-4 md:px-12 bg-slate-50">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-heading font-black uppercase text-slate-900 mb-2 tracking-tighter">Payment</h1>
            <p className="text-[9px] font-black uppercase text-slate-400 tracking-[0.3em]">Easy & Secure Settlement</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex gap-3">
            <button onClick={() => setMethod('bKash')} className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${method === 'bKash' ? 'bg-[#D12053] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>bKash</button>
            <button onClick={() => setMethod('Nagad')} className={`flex-1 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all ${method === 'Nagad' ? 'bg-[#f97316] text-white shadow-lg' : 'bg-white text-slate-400 border border-slate-100'}`}>Nagad</button>
          </div>

          <div className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-xl space-y-8">
               <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
                  <div className="bg-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shrink-0">1</div>
                  <p className="text-sm font-bold text-slate-900 leading-tight"><BanglaText>এই নম্বরে "{total}৳" সেন্ড মানি করুন (পার্সোনাল)</BanglaText></p>
               </div>

               <div className="flex flex-col gap-6">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Target Number (Click to copy)</p>
                    <button 
                      onClick={() => { navigator.clipboard.writeText(paymentNumber); alert('নম্বর কপি হয়েছে!'); }}
                      className="w-full flex items-center justify-between bg-slate-50 px-6 py-5 rounded-2xl font-heading font-black text-slate-900 text-xl border border-slate-100 active:scale-95 transition-all"
                    >
                      <span>{paymentNumber}</span>
                      <Check size={20} className="text-pink-500" />
                    </button>
                  </div>

                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-3">Your {method} Number</p>
                    <input 
                      type="text" 
                      placeholder="017XXXXXXXX"
                      value={senderNumber}
                      onChange={e => setSenderNumber(e.target.value)}
                      className="w-full bg-white border-2 border-slate-100 px-6 py-5 rounded-2xl font-heading font-black text-slate-900 text-center focus:outline-none focus:border-pink-500"
                    />
                  </div>
               </div>

               <div className="pt-4 flex flex-col gap-3">
                  <button 
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className={`w-full py-5 rounded-2xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-xl disabled:opacity-50 ${method === 'bKash' ? 'bg-[#D12053]' : 'bg-[#f97316]'}`}
                  >
                    {isProcessing ? 'Verifying...' : 'Submit Payment Info'}
                  </button>
                  
                  <a 
                    href={generateWhatsAppLink(cart, JSON.parse(localStorage.getItem('sociafy_pending_order_info') || '{}'), total)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-green-600 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-xl flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14} /> Pay via WhatsApp directly
                  </a>
               </div>
          </div>
        </div>
      </div>
    </div>
  );
};

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
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
          </Routes>
        </main>
        
        <footer className="bg-white pt-16 pb-12 border-t border-slate-100 px-4 md:px-12 text-center">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <span className="text-xl md:text-2xl font-heading font-black tracking-tighter text-slate-900 block mb-1">Sociafy</span>
              <span className="text-[8px] md:text-[10px] font-black text-pink-500 uppercase tracking-widest">Premium Digital Growth Since 2021</span>
            </div>
            
            <div className="flex flex-col items-center gap-6 mb-10">
               <div className="flex gap-6">
                  <a href={SOCIAFY_INFO.facebook} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#1877F2]"><Facebook size={20} /></a>
                  <a href={SOCIAFY_INFO.instagram} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-[#E4405F]"><Instagram size={20} /></a>
                  <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-green-600"><MessageCircle size={20} /></a>
               </div>
               <div className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-slate-300">© {new Date().getFullYear()} Sociafy Digital. All Rights Reserved.</div>
            </div>
          </div>
        </footer>

        <a href={SOCIAFY_INFO.whatsapp} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] text-white p-3 md:pr-6 md:pl-4 md:py-3 rounded-full shadow-2xl hover:scale-105 transition-all group active:scale-95">
          <MessageCircle size={24} />
          <span className="hidden md:block font-heading font-black uppercase text-[10px] tracking-widest">WhatsApp directly</span>
        </a>
      </div>
    </Router>
  </CartProvider>
);

const ReviewsPage = () => (
  <div className="pt-24 md:pt-40 pb-32 bg-slate-50 px-4 md:px-12 min-h-screen">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-7xl font-heading font-black uppercase text-slate-900 mb-4 tracking-tighter">Reviews</h1>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px]">Trusted by Clients</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVIEWS.map((r, i) => (
          <div key={i} className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm flex flex-col hover:shadow-lg transition-all">
            <div className="flex gap-0.5 mb-6">{[1,2,3,4,5].map(s => <Star key={s} size={12} fill="#F472B6" stroke="#F472B6" />)}</div>
            <p className="text-base md:text-lg font-medium text-slate-700 italic mb-8 leading-relaxed font-heading">"{r.text}"</p>
            <div className="mt-auto flex items-center justify-between">
                <span className="font-heading font-black uppercase text-slate-900 text-xs tracking-tight">{r.name}</span>
                <CheckCircle2 size={16} className="text-green-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default App;
