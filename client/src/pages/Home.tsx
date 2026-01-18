import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { CategoryBar } from "@/components/menu/CategoryBar";
import { FoodCard } from "@/components/menu/FoodCard";
import { ProductModal } from "@/components/menu/ProductModal"; // تأكد من وجود هذا المكون
import { CartDrawer } from "@/components/cart/CartDrawer"; // تأكد من وجود هذا المكون
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { MenuItem } from "@/data/menu";
import { subscribeMenuFromFirebase } from "@/lib/firebase-menu";

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [liveMenu, setLiveMenu] = useState<MenuItem[]>([]); // المنيو الحي من السيرفر
  const { language, direction, isCartOpen, setIsCartOpen } = useCart();

  // جلب البيانات الحية من Firebase و Neon
  useEffect(() => {
    const unsub = subscribeMenuFromFirebase(setLiveMenu);
    fetch('/api/menu').then(r => r.json()).then(setLiveMenu);
    return unsub;
  }, []);

  const filteredItems = useMemo<MenuItem[]>(() => {
    if (selectedCategory === "all") return liveMenu;
    return liveMenu.filter((item) => item.categoryId === selectedCategory);
  }, [selectedCategory, liveMenu]);

  return (
    <div className={cn(direction === 'rtl' ? 'font-arabic' : '')}>
      <Header onCartClick={() => setIsCartOpen(true)} />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">
            {language === "ar" ? "التصنيفات" : "Categories"}
          </h2>
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onClick={() => setSelectedProduct(item)} // تفعيل النقر لفتح المودال
            />
          ))}
        </div>
      </main>

      {/* نافذة تفاصيل الوجبة (لاختيار الإضافات مثل "بدون بندورة") */}
      {selectedProduct && (
        <ProductModal 
          item={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}

      {/* السلة الجانبية */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default Home;
