import React, { useRef } from 'react';
import { CATEGORIES } from '@/data/menu';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export function CategoryBar({ selectedCategory, onSelectCategory }: CategoryBarProps) {
  const { language } = useCart();
  
  return (
    <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-sm border-b border-border py-3">
      <div className="container mx-auto">
        <div className="flex overflow-x-auto gap-3 px-4 no-scrollbar pb-1 items-center">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 shadow-sm border",
                selectedCategory === cat.id 
                  ? "bg-primary text-primary-foreground border-primary shadow-md transform scale-105" 
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
                language === 'ar' ? "font-cairo" : "font-poppins"
              )}
            >
              {cat.name[language]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
