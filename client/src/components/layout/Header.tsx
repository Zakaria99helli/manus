import React from 'react';
import { useCart } from '@/store/cart';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  const { language, setLanguage, itemCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="font-bold text-xl text-primary">Damas Food</div>
        
        <div className="flex items-center gap-4">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-md">
            {['ar', 'fr', 'en'].map((l) => (
              <button key={l} onClick={() => setLanguage(l as any)} className={`px-2 py-1 text-xs rounded ${language === l ? 'bg-white shadow-sm' : ''}`}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <Button variant="outline" size="icon" className="relative" onClick={() => setIsCartOpen(true)}>
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
