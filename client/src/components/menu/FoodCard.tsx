import React from 'react';
import { MenuItem, UI_TEXT } from '@/data/menu';
import { useCart } from '@/store/cart';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FoodCardProps {
  item: MenuItem;
  onClick?: () => void;
}

export function FoodCard({ item, onClick }: FoodCardProps) {
  const { language, addToCart } = useCart();
  
  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(item, 1, [], [], 0);
  };

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="aspect-[4/3] w-full overflow-hidden">
        <img 
          src={item.image} 
          alt={item.name[language]} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className={cn(
            "font-bold text-gray-900 line-clamp-1",
            language === 'ar' ? "font-cairo text-lg" : "font-poppins text-base"
          )}>
            {item.name[language]}
          </h3>
          <span className="font-semibold text-primary">
            €{item.price.toFixed(2)}
          </span>
        </div>
        
        <p className={cn(
          "text-xs text-gray-500 line-clamp-2 min-h-[2.5em]",
          language === 'ar' ? "font-cairo" : "font-poppins"
        )}>
          {item.description[language]}
        </p>
        
        <Button 
          size="sm" 
          onClick={handleAdd}
          className="w-full mt-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium shadow-none border-0 group-hover:bg-primary group-hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4 mr-1" />
          {UI_TEXT.addToCart[language]}
        </Button>
      </div>
    </div>
  );
}
