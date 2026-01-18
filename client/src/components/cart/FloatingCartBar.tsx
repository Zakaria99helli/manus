import React from 'react';
import { useCart } from '@/store/cart';
import { UI_TEXT } from '@/data/menu';
import { ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FloatingCartBarProps {
  onClick: () => void;
}

export function FloatingCartBar({ onClick }: FloatingCartBarProps) {
  const { cartTotal, itemCount, language } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 z-50 animate-in slide-in-from-bottom-10 fade-in duration-300">
      <button 
        onClick={onClick}
        className={cn(
          "w-full bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/30 p-4 flex items-center justify-between transition-transform active:scale-[0.98]",
          language === 'ar' ? "font-cairo" : "font-poppins"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="bg-white/20 px-3 py-1 rounded-lg font-bold">
            {itemCount}
          </div>
          <span className="font-semibold text-lg">{UI_TEXT.viewCart[language]}</span>
        </div>
        <span className="font-bold text-xl">
          €{cartTotal.toFixed(2)}
        </span>
      </button>
    </div>
  );
}
