import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.4 }}
            className="relative bg-[#0A0A0A] border border-white/[0.08] w-full max-w-lg rounded-xl shadow-2xl p-6 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#EDEDED]">{title}</h2>
              <button 
                onClick={onClose} 
                className="p-1 rounded-md text-[#666] hover:text-[#EDEDED] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {children}
            
            {/* Glossy gradient highlight */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
