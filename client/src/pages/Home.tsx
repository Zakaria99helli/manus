import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { CategoryBar } from "@/components/menu/CategoryBar";
import { FoodCard } from "@/components/menu/FoodCard";
import { ProductModal } from "@/components/menu/ProductModal"; 
import { CartDrawer } from "@/components/cart/CartDrawer";
import { useCart } from "@/store/cart";
import { MenuItem } from "@/data/menu";
import { subscribeMenuFromFirebase } from "@/lib/firebase-menu";

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // هذه الحالات (States) هي المسؤولة عن فتح وإغلاق نافذة خيارات الوجبة
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [liveMenu, setLiveMenu] = useState<MenuItem[]>([]);
  const { language, direction, isCartOpen, setIsCartOpen } = useCart();

  // جلب البيانات الحية لضمان أن التعديلات في الإدارة تظهر هنا
  useEffect(() => {
    fetch('/api/menu')
      .then(r => r.json())
      .then(setLiveMenu)
      .catch(err => console.error("Error loading menu:", err));

    const unsub = subscribeMenuFromFirebase(setLiveMenu);
    return () => unsub();
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedCategory === "all") return liveMenu;
    return liveMenu.filter((item) => item.categoryId === selectedCategory);
  }, [selectedCategory, liveMenu]);

  return (
    <div className={direction === 'rtl' ? 'font-cairo' : ''}>
      <Header />
      
      <main className="container mx-auto px-4 py-6 pb-24">
        <div className="mb-8">
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
              onClick={() => {
                // عند الضغط على الوجبة، نحددها ونفتح النافذة
                setSelectedProduct(item);
                setIsModalOpen(true);
              }} 
            />
          ))}
        </div>
      </main>

      {/* نافذة خيارات الوجبة (التي تحتوي على الصوصات والإضافات) */}
      <ProductModal 
        item={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* السلة الجانبية التي تظهر عند الضغط على أيقونة السلة */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Home;
