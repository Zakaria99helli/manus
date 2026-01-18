import shawarmaImg from '/images/image_1768414783191.png';
import pizzaImg from '/images/image_1768414811497.png';
import tacosImg from '/images/image_1768414820469.png';
import assietteImg from '/images/image_1768414827805.png';
import burgerImg from '/images/image_1768414835820.png';
import falafelImg from '/images/image_1768414850525.png';
import platePouletImg from '/images/image_1768415002958.png';
import drinkImg from '/images/image_1768417204422.png';

export type Language = 'en' | 'fr' | 'ar';

export interface LocalizedString {
  en: string;
  fr: string;
  ar: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  image: string;
  name: LocalizedString;
  description: LocalizedString;
  price: number;
}

export interface Category {
  id: string;
  name: LocalizedString;
}

export const CATEGORIES: Category[] = [
  { id: 'all', name: { en: 'All', fr: 'Tout', ar: 'الكل' } },
  { id: 'sandwichs', name: { en: 'Sandwiches', fr: 'Sandwichs', ar: 'سندويش' } },
  { id: 'pizzas', name: { en: 'Pizzas', fr: 'Pizzas', ar: 'بيتزا' } },
  { id: 'burgers', name: { en: 'Burgers', fr: 'Burgers', ar: 'برجر' } },
  { id: 'assiettes', name: { en: 'Plates', fr: 'Assiettes', ar: 'وجبات' } },
  { id: 'pitatacos', name: { en: 'Pita / Tacos', fr: 'Pita / Tacos', ar: 'بيتا / تاكوس' } },
  { id: 'texmex', name: { en: 'Tex-Mex', fr: 'Tex-Mex', ar: 'تكس مكس' } },
  { id: 'boissons', name: { en: 'Drinks', fr: 'Boissons', ar: 'مشروبات' } },
  { id: 'desserts', name: { en: 'Desserts', fr: 'Desserts', ar: 'حلويات' } },
];

export const MENU_ITEMS: MenuItem[] = [
  // Sandwiches
  {
    id: 's1',
    categoryId: 'sandwichs',
    image: shawarmaImg,
    name: { en: 'Chicken Shawarma', fr: 'Shawarma Poulet', ar: 'شاورما دجاج' },
    description: { en: 'Syrian chicken shawarma, garlic, pickles', fr: 'Shawarma syrienne au poulet, ail, cornichons', ar: 'شاورما دجاج سورية، ثوم، مخلل' },
    price: 7.00
  },
  {
    id: 's2',
    categoryId: 'sandwichs',
    image: falafelImg,
    name: { en: 'Falafel', fr: 'Falafel', ar: 'فلافل' },
    description: { en: 'Falafel, hummus, salad, pickles', fr: 'Falafel, houmous, salade, cornichons', ar: 'فلافل، حمص، سلطة، مخلل' },
    price: 6.00
  },
  {
    id: 's3',
    categoryId: 'sandwichs',
    image: platePouletImg,
    name: { en: 'Kefta', fr: 'Kefta', ar: 'كفتة' },
    description: { en: 'Grilled kefta, parsley, onions, tomato', fr: 'Kefta grillée, persil, oignons, tomate', ar: 'كفتة مشوية، بقدونس، بصل، طماطم' },
    price: 7.00
  },
  {
    id: 's4',
    categoryId: 'sandwichs',
    image: platePouletImg,
    name: { en: 'Foie (Fawwa)', fr: 'Foie (Fawwa)', ar: 'سودة' },
    description: { en: 'Liver, onions, peppers', fr: 'Foie, oignons, poivrons', ar: 'سودة، بصل، فلفل' },
    price: 7.00
  },
  {
    id: 's5',
    categoryId: 'sandwichs',
    image: platePouletImg,
    name: { en: 'Shish Taouk', fr: 'Shish Taouk', ar: 'شيش طاووق' },
    description: { en: 'Grilled chicken, salad, garlic', fr: 'Poulet grillé, salade, ail', ar: 'دجاج مشوي، سلطة، ثوم' },
    price: 8.00
  },

  // Pizzas
  {
    id: 'p1',
    categoryId: 'pizzas',
    image: pizzaImg,
    name: { en: 'Margherita', fr: 'Margherita', ar: 'مارغريتا' },
    description: { en: 'Tomato sauce, mozzarella, oregano', fr: 'Sauce tomate, mozzarella, origan', ar: 'صلصة طماطم، موزاريلا، أوريغانو' },
    price: 7.00
  },
  {
    id: 'p2',
    categoryId: 'pizzas',
    image: pizzaImg,
    name: { en: 'Regina', fr: 'Regina', ar: 'ريجينا' },
    description: { en: 'Tomato sauce, mozzarella, ham, mushrooms', fr: 'Sauce tomate, mozzarella, jambon, champignons', ar: 'صلصة طماطم، موزاريلا، حبش، فطر' },
    price: 9.00
  },
  {
    id: 'p3',
    categoryId: 'pizzas',
    image: pizzaImg,
    name: { en: '4 Cheeses', fr: '4 Fromages', ar: 'أربع أجبان' },
    description: { en: 'Tomato sauce, mozzarella, blue cheese, goat cheese, emmental', fr: 'Sauce tomate, mozzarella, bleu, chèvre, emmental', ar: 'صلصة طماطم، موزاريلا، جبنة زرقاء، جبنة ماعز، إمنتال' },
    price: 10.00
  },
  {
    id: 'p4',
    categoryId: 'pizzas',
    image: pizzaImg,
    name: { en: 'Vegetarian', fr: 'Végétarienne', ar: 'نباتية' },
    description: { en: 'Tomato sauce, mozzarella, mushrooms, peppers, onions, olives', fr: 'Sauce tomate, mozzarella, champignons, poivrons, oignons, olives', ar: 'صلصة طماطم، موزاريلا، فطر، فلفل، بصل، زيتون' },
    price: 9.00
  },
  {
    id: 'p5',
    categoryId: 'pizzas',
    image: pizzaImg,
    name: { en: 'Oriental', fr: 'Orientale', ar: 'شرقية' },
    description: { en: 'Tomato sauce, mozzarella, merguez, poivrons', fr: 'Sauce tomate, mozzarella, merguez, poivrons', ar: 'صلصة طماطم، موزاريلا، مرقاز، فلفل' },
    price: 10.00
  },

  // Pita / Tacos
  {
    id: 'pt1',
    categoryId: 'pitatacos',
    image: tacosImg,
    name: { en: 'Taco 1 Meat', fr: 'Tacos 1 Viande', ar: 'تاكو 1 لحم' },
    description: { en: 'Taco with 1 meat, fries', fr: 'Tacos avec 1 viande, frites', ar: 'تاكو بلحم واحد، بطاطا' },
    price: 7.00
  },

  // Plates (Assiettes)
  {
    id: 'a1',
    categoryId: 'assiettes',
    image: assietteImg,
    name: { en: 'Shawarma Plate', fr: 'Assiette Shawarma', ar: 'وجبة شاورما' },
    description: { en: 'Chicken shawarma, salad, garlic, pickles', fr: 'Shawarma poulet, salade, ail, cornichons', ar: 'شاورما دجاج، سلطة، ثوم، مخلل' },
    price: 12.00
  },

  // Burgers
  {
    id: 'b1',
    categoryId: 'burgers',
    image: burgerImg,
    name: { en: 'Cheese Burger', fr: 'Cheese Burger', ar: 'تشيز برجر' },
    description: { en: 'Beef patty, cheddar, salad, tomato', fr: 'Steak, cheddar, salade, tomate', ar: 'برجر لحم، تشيدر، سلطة، طماطم' },
    price: 8.00
  },

  // Drinks
  {
    id: 'd1',
    categoryId: 'boissons',
    image: drinkImg,
    name: { en: 'Lemon Mint', fr: 'Citron Menthe', ar: 'ليمون نعناع' },
    description: { en: 'Fresh lemon with mint', fr: 'Citron frais à la menthe', ar: 'ليمون طازج مع نعناع' },
    price: 4.00
  },

  // Desserts
  {
    id: 'de1',
    categoryId: 'desserts',
    image: drinkImg,
    name: { en: 'Baklava', fr: 'Baklava', ar: 'بقلاوة' },
    description: { en: 'Assorted baklava', fr: 'Baklava assortie', ar: 'بقلاوة مشكلة' },
    price: 6.00
  }
];

export const UI_TEXT = {
  addToCart: { en: 'Add to Cart', fr: 'Ajouter au panier', ar: 'أضف إلى السلة' },
  customizations: { en: 'Customizations', fr: 'Personnalisation', ar: 'تخصيص' },
  extras: { en: 'Extras', fr: 'Suppléments', ar: 'إضافات' },
  removals: { en: 'Remove', fr: 'Retirer', ar: 'إزالة' },
  viewCart: { en: 'View Cart', fr: 'Voir le panier', ar: 'عرض السلة' },
  total: { en: 'Total', fr: 'Total', ar: 'المجموع' },
  orderNow: { en: 'Order Now', fr: 'Commander', ar: 'إرسال الطلب' },
  yourCart: { en: 'Your Cart', fr: 'Votre Panier', ar: 'سلة المشتريات' },
  emptyCart: { en: 'Your cart is empty', fr: 'Votre panier est vide', ar: 'سلتك فارغة' },
  extraCheese: { en: 'Extra Cheese', fr: 'Supplément Fromage', ar: 'جبن إضافي' },
  noOnions: { en: 'No Onions', fr: 'Sans Oignons', ar: 'بدون بصل' },
  noSauce: { en: 'No Sauce', fr: 'Sans Sauce', ar: 'بدون صلصة' },
  items: { en: 'items', fr: 'articles', ar: 'عناصر' },
  adminDashboard: { en: 'Admin Dashboard', fr: 'Tableau de bord Admin', ar: 'لوحة التحكم' },
  tableNumber: { en: 'Table #', fr: 'Table n°', ar: 'طاولة رقم' },
  orderSent: { en: 'Success!', fr: 'Succès!', ar: 'تم النجاح!' },
};
