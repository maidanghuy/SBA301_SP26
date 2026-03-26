import React from 'react';
import { Gift, Zap, TrendingDown, Clock, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const offers = [
  {
    id: 1,
    title: "GIẢM SỐC 50%",
    subtitle: "PHỤ KIỆN CHÍNH HÃNG",
    icon: <TrendingDown size={20} />,
    color: "bg-rose-500",
    link: "/?categoryId=7"
  },
  {
    id: 2,
    title: "FLASH SALE",
    subtitle: "MỖI NGÀY 12:00",
    icon: <Zap size={20} />,
    color: "bg-amber-500",
    link: "/"
  },
  {
    id: 3,
    title: "QUÀ TẶNG",
    subtitle: "CHO ĐƠN TỪ 5TR",
    icon: <Gift size={20} />,
    color: "bg-emerald-500",
    link: "/"
  }
];

const SpecialOffers: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Flash Sale Timer */}
      <div className="bg-primary p-4 rounded-2xl text-white shadow-lg shadow-primary/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Clock size={24} className="animate-pulse" />
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-80">Flash Sale</h4>
            <div className="text-xl font-black tracking-tighter">02:45:12</div>
          </div>
        </div>
        <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Offer Cards */}
      <div className="grid grid-cols-1 gap-4">
        {offers.map((offer) => (
          <Link
            key={offer.id}
            to={offer.link}
            className={`${offer.color} p-5 rounded-2xl text-white shadow-lg hover:scale-[1.02] transition-all group relative overflow-hidden`}
          >
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
              {React.cloneElement(offer.icon as React.ReactElement, { size: 100 })}
            </div>
            
            <div className="relative z-10">
              <div className="mb-2 opacity-80">{offer.icon}</div>
              <h4 className="text-lg font-black tracking-tighter leading-tight">{offer.title}</h4>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{offer.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Newsletter / Promo */}
      <div className="bg-white border border-neutral-200 p-5 rounded-2xl shadow-sm">
        <h4 className="text-[11px] font-black uppercase tracking-widest text-neutral-400 mb-3">Nhận tin khuyến mãi</h4>
        <div className="flex gap-2">
          <input 
            type="email" 
            placeholder="Email của bạn" 
            className="flex-1 bg-neutral-50 border border-neutral-100 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button className="bg-neutral-900 text-white p-2 rounded-xl hover:bg-primary transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffers;
