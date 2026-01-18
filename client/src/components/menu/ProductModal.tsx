import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { MenuItem, UI_TEXT } from '@/data/menu';
import { useCart } from '@/store/cart';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface ProductModalProps {
  item: MenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProductModal({ item, isOpen, onClose }: ProductModalProps) {
  const { language, addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [extras, setExtras] = useState<string[]>([]);

  // قائمة الصوصات
  const sauces = [
    { id: 'algerien', label: { en: 'Algérien', fr: 'Algérien', ar: 'الجيريَن' }, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=80&q=80' },
    { id: 'harissa', label: { en: 'Harissa', fr: 'Harissa', ar: 'هريسه' }, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=80&q=80' },
    { id: 'samourai', label: { en: 'Samourai', fr: 'Samourai', ar: 'ساموراي' }, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=80&q=80' },
    { id: 'andalouse', label: { en: 'Andalouse', fr: 'Andalouse', ar: 'اندالوس' }, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=80&q=80' },
    { id: 'ketchup', label: { en: 'Ketchup', fr: 'Ketchup', ar: 'كاتشب' }, img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=80&q=80' },
    { id: 'mayonnaise', label: { en: 'Mayonnaise', fr: 'Mayonnaise', ar: 'مايونيز' }, img: 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=80&q=80' },
    { id: 'barbecue', label: { en: 'Barbecue', fr: 'Barbecue', ar: 'باربيكيو' }, img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=80&q=80' },
    { id: 'bigburger', label: { en: 'Big Burger', fr: 'Big Burger', ar: 'بيجيبرغر' }, img: 'https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=80&q=80' },
  ];
  const [removals, setRemovals] = useState<string[]>([]);
  
  // Reset state when item changes
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setExtras([]);
      setRemovals([]);
    }
  }, [isOpen, item]);

  if (!item) return null;

  const extraCheeseCost = 1.50;
  const currentTotal = (item.price + (extras.includes('cheese') ? extraCheeseCost : 0)) * quantity;

  const handleAddToCart = () => {
    addToCart(
      item, 
      quantity, 
      extras, 
      removals, 
      extras.includes('cheese') ? extraCheeseCost : 0
    );
    onClose();
  };

  const toggleExtra = (id: string) => {
    setExtras(prev => 
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const toggleRemoval = (id: string) => {
    setRemovals(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={cn(
        "sm:max-w-md p-0 overflow-hidden max-h-[90vh] flex flex-col",
        language === 'ar' ? "font-cairo" : "font-poppins"
      )}>
        <div className="relative h-48 w-full shrink-0">
          <img 
            src={item.image} 
            alt={item.name[language]} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <h2 className="absolute bottom-4 left-4 right-4 text-2xl font-bold text-white">
            {item.name[language]}
          </h2>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
          <p className="text-gray-600 mb-6">{item.description[language]}</p>

          {/* Extras & Removals only for non-desserts */}
          {item.categoryId !== 'desserts' && (
            <div className="space-y-6">
              {/* Extras Section */}
              <div>
                <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full"></span>
                  {UI_TEXT.extras[language]}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-primary/30 cursor-pointer transition-colors" onClick={() => toggleExtra('cheese')}>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Checkbox checked={extras.includes('cheese')} onCheckedChange={() => toggleExtra('cheese')} />
                      <Label className="cursor-pointer font-medium">{UI_TEXT.extraCheese[language]}</Label>
                    </div>
                    <span className="text-primary font-semibold">+€{extraCheeseCost.toFixed(2)}</span>
                  </div>
                  {/* صوصات إضافية */}
                  {sauces.map(sauce => (
                    <div key={sauce.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-primary/30 cursor-pointer transition-colors" onClick={() => toggleExtra(sauce.id)}>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={sauce.img} alt={sauce.label[language]} className="w-8 h-8 rounded-full object-cover border" />
                        <Checkbox checked={extras.includes(sauce.id)} onCheckedChange={() => toggleExtra(sauce.id)} />
                        <Label className="cursor-pointer font-medium">{sauce.label[language]}</Label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Removals Section */}
              <div>
                <h3 className="font-semibold mb-3 text-lg flex items-center gap-2">
                  <span className="w-1 h-6 bg-red-400 rounded-full"></span>
                  {UI_TEXT.removals[language]}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-red-200 cursor-pointer transition-colors" onClick={() => toggleRemoval('onion')}>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Checkbox checked={removals.includes('onion')} onCheckedChange={() => toggleRemoval('onion')} />
                      <Label className="cursor-pointer font-medium">{UI_TEXT.noOnions[language]}</Label>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-red-200 cursor-pointer transition-colors" onClick={() => toggleRemoval('sauce')}>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse">
                      <Checkbox checked={removals.includes('sauce')} onCheckedChange={() => toggleRemoval('sauce')} />
                      <Label className="cursor-pointer font-medium">{UI_TEXT.noSauce[language]}</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 rtl:space-x-reverse bg-white p-1 rounded-lg border shadow-sm">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 hover:bg-gray-100 rounded-md"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-bold w-4 text-center">{quantity}</span>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 hover:bg-gray-100 rounded-md"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-xl font-bold text-primary">
              €{currentTotal.toFixed(2)}
            </div>
          </div>
          
          <Button className="w-full text-lg py-6 font-bold shadow-lg shadow-primary/20" onClick={handleAddToCart}>
            {UI_TEXT.addToCart[language]}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
