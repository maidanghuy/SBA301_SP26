import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const banners = [
  {
    id: 1,
    title: "SAMSUNG GALAXY S24 ULTRA",
    subtitle: "AI IS HERE",
    description: "Trải nghiệm quyền năng AI mới nhất trên dòng Galaxy S series.",
    image: "https://picsum.photos/seed/s24/1200/600",
    color: "bg-neutral-900",
    textColor: "text-white",
    link: "/product/1"
  },
  {
    id: 2,
    title: "MACBOOK PRO M3 SERIES",
    subtitle: "MẠNH MẼ VƯỢT TRỘI",
    description: "Hiệu năng đỉnh cao cho mọi công việc sáng tạo và lập trình.",
    image: "https://picsum.photos/seed/macbook/1200/600",
    color: "bg-indigo-900",
    textColor: "text-white",
    link: "/product/2"
  },
  {
    id: 3,
    title: "AIRPODS MAX 2026",
    subtitle: "ÂM THANH SỐNG ĐỘNG",
    description: "Khử tiếng ồn chủ động và âm thanh không gian đỉnh cao.",
    image: "https://picsum.photos/seed/airpods/1200/600",
    color: "bg-rose-900",
    textColor: "text-white",
    link: "/product/3"
  }
];

const HomeBanner: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % banners.length);
  const prev = () => setCurrent((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className={`absolute inset-0 ${banners[current].color} flex items-center`}
        >
          <div className="absolute inset-0 opacity-40">
            <img 
              src={banners[current].image} 
              alt={banners[current].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="relative z-10 px-12 max-w-lg">
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[11px] font-black uppercase tracking-widest text-primary bg-white px-3 py-1 rounded-full inline-block mb-4"
            >
              {banners[current].subtitle}
            </motion.span>
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className={`text-5xl font-black ${banners[current].textColor} uppercase tracking-tighter leading-none mb-4`}
            >
              {banners[current].title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className={`text-sm ${banners[current].textColor} opacity-70 mb-8 font-medium`}
            >
              {banners[current].description}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link 
                to={banners[current].link}
                className="inline-flex items-center gap-2 bg-white text-neutral-900 px-8 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl"
              >
                <ShoppingBag size={16} />
                Mua ngay
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button 
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-neutral-900 z-20"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-neutral-900 z-20"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-12 flex gap-2 z-20">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              current === i ? 'w-8 bg-white' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;
