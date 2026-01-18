import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UI_TEXT = {
  checkout: { en: 'Checkout', fr: 'Passer la commande', ar: 'الدفع' },
  customerName: { en: 'Customer Name', fr: 'Nom du client', ar: 'اسم العميل' },
  phoneNumber: { en: 'Phone Number', fr: 'Numéro de téléphone', ar: 'رقم الهاتف' },
  address: { en: 'Delivery Address', fr: 'Adresse de livraison', ar: 'عنوان التوصيل' },
  placeOrder: { en: 'Place Order', fr: 'Passer la commande', ar: 'تأكيد الطلب' },
  orderSuccess: { en: 'Order Placed Successfully!', fr: 'Commande passée avec succès!', ar: 'تم تأكيد الطلب بنجاح!' },
  orderError: { en: 'Failed to place order', fr: 'Erreur lors de la commande', ar: 'فشل في تأكيد الطلب' },
  fillAllFields: { en: 'Please fill all fields', fr: 'Veuillez remplir tous les champs', ar: 'يرجى ملء جميع الحقول' },
};

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { language, submitOrder, isSubmitting, cartTotal } = useCart();
  const [formData, setFormData] = useState({
    tableNumber: '',
  });

  // التقاط رقم الطاولة من رابط الصفحة تلقائياً
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const table = params.get('table') || '';
    setFormData(f => ({ ...f, tableNumber: table }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.tableNumber) {
      toast({
        title: 'يرجى مسح QR من الطاولة',
        variant: 'destructive',
      });
      return;
    }
    try {
      await submitOrder(formData.tableNumber);
      toast({
        title: UI_TEXT.orderSuccess[language],
        description: `Total: €${cartTotal.toFixed(2)}`,
      });
      setFormData({ tableNumber: '' });
      onClose();
    } catch (error) {
      toast({
        title: UI_TEXT.orderError[language],
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn("sm:max-w-md", language === 'ar' ? "font-cairo" : "font-poppins")}>
        <DialogHeader>
          <DialogTitle>{UI_TEXT.checkout[language]}</DialogTitle>
        </DialogHeader>


        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              {UI_TEXT.tableNumber?.[language] || 'Table Number'}
            </label>
            <Input
              type="number"
              placeholder={UI_TEXT.tableNumber?.[language] || 'Table Number'}
              value={formData.tableNumber}
              onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
              disabled={isSubmitting || Boolean(formData.tableNumber)}
            />
            <p className="text-xs text-gray-500 mt-1">يتم تعبئة رقم الطاولة تلقائياً عند مسح QR</p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              {language === 'en' ? 'Cancel' : language === 'fr' ? 'Annuler' : 'إلغاء'}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? language === 'en'
                  ? 'Placing...'
                  : language === 'fr'
                  ? 'En cours...'
                  : 'جاري...'
                : UI_TEXT.placeOrder[language]}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
