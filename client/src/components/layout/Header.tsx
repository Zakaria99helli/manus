import React from 'react';
import { useCart } from '@/store/cart';
import { ShoppingCart, Globe, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Header() {
  const { language, setLanguage, itemCount, cartTotal } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <span className="text-xl font-bold">D</span>
          </div>
          <div className="hidden sm:block">
            <h1 className={cn(
              "font-bold text-gray-900 leading-none",
              language === 'ar' ? "font-cairo text-lg" : "font-poppins text-base"
            )}>
              Damas Food
            </h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider">Specialties</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            {(['ar', 'fr', 'en'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-bold transition-all",
                  language === lang 
                    ? "bg-white text-primary shadow-sm" 
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>

          <Button variant="outline" size="icon" className="relative rounded-xl border-gray-200">
            <ShoppingCart className="w-5 h-5 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
