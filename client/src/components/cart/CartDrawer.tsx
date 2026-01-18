import React, { useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from '@/components/ui/drawer';
import { useCart } from '@/store/cart';
import { UI_TEXT } from '@/data/menu';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckoutModal } from './CheckoutModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    cart, 
    cartTotal, 
    language, 
    updateQuantity, 
    removeFromCart,
  } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DrawerContent className={cn("h-[95vh] flex flex-col", language === 'ar' ? "font-cairo" : "font-poppins")}>
          <div className="mx-auto w-full max-w-lg flex-1 flex flex-col">
            <DrawerHeader className="border-b border-gray-100 pb-4">
              <DrawerTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                <ShoppingBag className="w-6 h-6 text-primary" />
                {UI_TEXT.yourCart[language]}
              </DrawerTitle>
            </DrawerHeader>
            
            <ScrollArea className="flex-1 p-4">
              {cart.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p className="text-lg">{UI_TEXT.emptyCart[language]}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.cartId} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex gap-4 animate-in slide-in-from-bottom-2">
                      <img src={item.image} alt="" className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-gray-900 truncate pr-2">{item.name[language]}</h4>
                          <span className="font-bold text-primary">€{item.totalPrice.toFixed(2)}</span>
                        </div>
                        
                        {(item.selectedExtras.length > 0 || item.selectedRemovals.length > 0) && (
                          <div className="text-xs text-gray-500 mb-3 space-y-0.5">
                            {item.selectedExtras.map(e => (
                              <div key={e} className="text-green-600 flex items-center gap-1">
                                <Plus className="w-3 h-3" /> {e === 'cheese' ? UI_TEXT.extraCheese[language] : e}
                              </div>
                            ))}
                            {item.selectedRemovals.map(r => (
                              <div key={r} className="text-red-400 flex items-center gap-1">
                                <Minus className="w-3 h-3" /> {r === 'onion' ? UI_TEXT.noOnions[language] : r === 'sauce' ? UI_TEXT.noSauce[language] : r}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                            <button 
                              className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm active:scale-95 transition-transform"
                              onClick={() => updateQuantity(item.cartId, -1)}
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                            <button 
                              className="w-7 h-7 flex items-center justify-center rounded-md bg-white shadow-sm active:scale-95 transition-transform"
                              onClick={() => updateQuantity(item.cartId, 1)}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <button 
                            className="text-red-400 hover:text-red-600 p-2 transition-colors"
                            onClick={() => removeFromCart(item.cartId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            {cart.length > 0 && (
              <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-500 font-medium">{UI_TEXT.total[language]}</span>
                  <span className="text-2xl font-bold text-gray-900">€{cartTotal.toFixed(2)}</span>
                </div>
                <Button 
                  className="w-full text-lg py-6 font-bold shadow-lg shadow-primary/20"
                  onClick={handleCheckout}
                >
                  {UI_TEXT.orderNow[language]}
                </Button>
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      <CheckoutModal 
        isOpen={showCheckout}
        onClose={() => {
          setShowCheckout(false);
          onClose();
        }}
      />
    </>
  );
}
