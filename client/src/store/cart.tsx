import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, LocalizedString } from '@/data/menu';
import { pushOrderToFirebase } from '@/lib/firebase-orders';

export interface CartItem extends MenuItem {
  cartId: string; // Unique ID for this instance in cart
  quantity: number;
  selectedExtras: string[];
  selectedRemovals: string[];
  totalPrice: number;
}

export interface User {
  id: string;
  username: string;
  role: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, extras: string[], removals: string[], extraCost: number) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  language: 'en' | 'fr' | 'ar';
  setLanguage: (lang: 'en' | 'fr' | 'ar') => void;
  direction: 'ltr' | 'rtl';
  // Order submission
  submitOrder: (tableNumber: string) => Promise<any>;
  isSubmitting: boolean;
  // Auth
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [language, setLanguage] = useState<'en' | 'fr' | 'ar'>('fr');
  const [user, setUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const direction = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to check auth:', error);
      }
    };
    checkAuth();
  }, []);

  const addToCart = (
    item: MenuItem, 
    quantity: number, 
    extras: string[], 
    removals: string[],
    extraCost: number
  ) => {
    const newItem: CartItem = {
      ...item,
      cartId: Math.random().toString(36).substr(2, 9),
      quantity,
      selectedExtras: extras,
      selectedRemovals: removals,
      totalPrice: (item.price + extraCost) * quantity
    };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQuantity = item.quantity + delta;
        if (newQuantity < 1) return item;
        const unitPrice = item.totalPrice / item.quantity;
        return {
          ...item,
          quantity: newQuantity,
          totalPrice: unitPrice * newQuantity
        };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const submitOrder = async (tableNumber: string) => {
    setIsSubmitting(true);
    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
        selectedExtras: item.selectedExtras,
        selectedRemovals: item.selectedRemovals,
      }));
      const orderPayload = {
        tableNumber,
        items: orderItems,
        total: cartTotal,
        createdAt: new Date().toISOString(),
      };
      // Send to backend
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      });
      if (!response.ok) {
        throw new Error('Failed to submit order');
      }
      const order = await response.json();
      // Send to Firebase
      try {
        await pushOrderToFirebase({
          ...orderPayload,
          id: order.id,
        });
      } catch (e) {
        // Firebase failure should not block order
        console.error('Firebase push failed', e);
      }
      clearCart();
      return order;
    } finally {
      setIsSubmitting(false);
    }
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const userData = await response.json();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });

      if (response.ok) {
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart, 
      cartTotal, 
      itemCount,
      language,
      setLanguage,
      direction,
      submitOrder,
      isSubmitting,
      user,
      login,
      logout,
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
