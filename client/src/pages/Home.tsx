import React, { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { CategoryBar } from "@/components/menu/CategoryBar";
import { FoodCard } from "@/components/menu/FoodCard";
import { ProductModal } from "@/components/menu/ProductModal"; 
import { CartDrawer } from "@/components/cart/CartDrawer";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { MenuItem } from "@/data/menu";
import { subscribeMenuFromFirebase } from "@/lib/firebase-menu";

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // حالات التحكم في النوافذ المنبثقة
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // حالة المنيو الحي
  const [liveMenu, setLiveMenu] = useState<MenuItem[]>([]);
  
  const { language, direction, isCartOpen, setIsCartOpen } = useCart();

  // جلب البيانات من السيرفر ومن Firebase لضمان التحديث اللحظي
  useEffect(() => {
    // جلب البيانات الأولية من API نيون
    fetch('/api/menu')
      .then(r => r.json())
      .then(data => setLiveMenu(data))
      .catch(err => console.error("Error fetching menu:", err));

    // الاشتراك في تحديثات Firebase (للتغييرات اللحظية)
    const unsub = subscribeMenuFromFirebase((menuData) => {
      if (menuData && menuData.length > 0) {
        setLiveMenu(menuData);
      }
    });

    return () => unsub();
  }, []);

  // تصفية الوجبات حسب التصنيف المختار
  const filteredItems = useMemo<MenuItem[]>(() => {
    if (selectedCategory === "all") return liveMenu;
    return liveMenu.filter((item) => item.categoryId === selectedCategory);
  }, [selectedCategory, liveMenu]);

  return (
    <div className={cn("min-h-screen bg-gray-50", direction === 'rtl' ? 'font-cairo' : '')}>
      {/* الهيدر الآن سيفتح السلة عند الضغط على الأيقونة */}
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">
            {language === "ar" ? "قائمة الطعام" : language === "fr" ? "Le Menu" : "Our Menu"}
          </h2>
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
        </div>

        {/* عرض الوجبات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <FoodCard 
              key={item.id} 
              item={item} 
              onClick={() => {
                setSelectedProduct(item);
                setIsModalOpen(true); // فتح نافذة الإضافات عند الضغط على الوجبة
              }} 
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            {language === "ar" ? "جاري تحميل المنيو..." : "Loading menu..."}
          </div>
        )}
      </main>

      {/* نافذة تفاصيل الوجبة (الصوصات، بدون بصل، إلخ) */}
      <ProductModal 
        item={selectedProduct} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* السلة الجانبية التي تظهر عند الضغط على أيقونة السلة في الهيدر */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
    </div>
  );
};

export default Home;
