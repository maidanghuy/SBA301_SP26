import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { FileQuestion, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-neutral-900 p-6 rounded-[4px] mb-8"
      >
        <FileQuestion size={64} className="text-white" />
      </motion.div>
      
      <h1 className="text-6xl font-black tracking-tighter mb-4">404</h1>
      <h2 className="text-xl font-bold uppercase tracking-widest text-neutral-500 mb-8">Page Not Found</h2>
      
      <p className="max-w-md text-neutral-400 mb-10">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      
      <Link 
        to="/" 
        className="flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-[4px] font-bold uppercase tracking-widest text-xs hover:bg-neutral-800 transition-all"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
