import React, { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { CategoryBar } from "@/components/menu/CategoryBar";
import { FoodCard } from "@/components/menu/FoodCard";
import { cn } from "@/lib/utils";
import { useCart } from "@/store/cart";
import { MENU_ITEMS, MenuItem } from "@/data/menu";

const Home: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { language, direction } = useCart();

  const filteredItems = useMemo<MenuItem[]>(() => {
    if (selectedCategory === "all") return MENU_ITEMS;
    return MENU_ITEMS.filter((item) => item.categoryId === selectedCategory);
  }, [selectedCategory]);

  return (
    <div>
      <Header />
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
            <FoodCard key={item.id} item={item} onClick={() => {}} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
