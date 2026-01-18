import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserForm } from '@/components/ui/user-form';
import { RefreshCcw, LogOut, Bell, CheckCircle2, Utensils, MinusCircle, PlusCircle } from 'lucide-react';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

export default function Admin() {
  interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    name: { en: string; fr: string; ar: string };
    selectedExtras: string[];
    selectedRemovals: string[];
  }

  interface Order {
    id: string;
    tableNumber: string;
    items: OrderItem[];
    total: string;
    status: string;
    createdAt: string;
  }

  const { user, login, logout, isLoading, language } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [archivedOrders, setArchivedOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editUser, setEditUser] = useState<any | null>(null);
  const prevOrdersCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [, navigate] = useLocation();

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      if (res.ok) setUsers(await res.json());
    } catch (error) { console.error('Failed to fetch users:', error); }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
        // تشغيل صوت التنبيه إذا زاد عدد الطلبات
        if (data.length > prevOrdersCount.current) {
          audioRef.current?.play().catch(e => console.log('Audio error:', e));
        }
        prevOrdersCount.current = data.length;
      }
      const archivedRes = await fetch('/api/orders/archived');
      if (archivedRes.ok) setArchivedOrders(await archivedRes.json());
    } catch (error) { console.error('Failed to fetch orders:', error); }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000); // تحديث تلقائي كل 5 ثواني
      if (user.role === 'owner' || user.role === 'manager') fetchUsers();
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      setUsername('');
      setPassword('');
    } catch (error) { console.error('Login failed'); }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    await fetch(`/api/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchOrders();
  };

  const archiveOrder = async (orderId: string) => {
    await fetch(`/api/orders/${orderId}/archive`, { method: 'POST' });
    fetchOrders();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-cairo">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-primary">Damas Food</h1>
            <p className="text-gray-500">لوحة إدارة المطبخ والكاشير</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="text" placeholder="اسم المستخدم" value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button type="submit" className="w-full py-6 text-lg font-bold" disabled={isLoading}>
              {isLoading ? 'جاري الدخول...' : 'تسجيل الدخول'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-slate-50", language === 'ar' ? "font-cairo" : "font-poppins")} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3" preload="auto" />
      
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-lg"><Utensils className="text-primary w-6 h-6" /></div>
          <div>
            <h1 className="text-xl font-black text-slate-800">شاشة الطلبات الحية</h1>
            <p className="text-xs text-green-600 font-bold">متصل الآن - تحديث مباشر</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={fetchOrders} className="font-bold">
            <RefreshCcw className="w-4 h-4 ml-2" /> تحديث
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout} className="font-bold">
            <LogOut className="w-4 h-4 ml-2" /> خروج
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-full mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Active Orders Column */}
          <div className="xl:col-span-2">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-2 text-slate-800">
              <Bell className="text-orange-500 animate-bounce" /> الطلبات النشطة 
              <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">{orders.length}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orders.length === 0 ? (
                <div className="col-span-full bg-white border-2 border-dashed rounded-2xl py-20 text-center text-slate-400">
                  <Utensils className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p className="text-xl">لا توجد طلبات جديدة حالياً</p>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white rounded-2xl shadow-md border-2 border-slate-100 overflow-hidden hover:border-primary/50 transition-colors">
                    <div className="bg-slate-800 p-4 text-white flex justify-between items-center">
                      <span className="text-2xl font-black">طاولة {order.tableNumber}</span>
                      <span className="text-xs opacity-70">{new Date(order.createdAt).toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="p-4 space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="border-b border-slate-50 pb-3 last:border-0">
                          <div className="flex justify-between items-start">
                            <span className="text-lg font-bold text-slate-800">{item.quantity} × {item.name[language as keyof typeof item.name]}</span>
                            <span className="font-bold text-primary">€{(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          
                          {/* عرض الإضافات والمحذوفات بوضوح */}
                          <div className="mt-1 space-y-1">
                            {item.selectedRemovals?.map(r => (
                              <div key={r} className="text-red-600 text-sm font-bold flex items-center gap-1">
                                <MinusCircle className="w-3 h-3" /> بدون {r}
                              </div>
                            ))}
                            {item.selectedExtras?.map(e => (
                              <div key={e} className="text-green-600 text-sm font-bold flex items-center gap-1">
                                <PlusCircle className="w-3 h-3" /> إكسترا {e}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-4 bg-slate-50 border-t flex flex-col gap-3">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-500">إجمالي الحساب:</span>
                        <span className="text-2xl font-black text-slate-900">€{Number(order.total).toFixed(2)}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Button className="font-bold bg-green-600 hover:bg-green-700" onClick={() => updateOrderStatus(order.id, 'completed')}>
                          إكمال الطلب
                        </Button>
                        <Button variant="outline" className="font-bold border-slate-300" onClick={() => archiveOrder(order.id)}>
                          أرشفة
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Archived Column */}
          <div className="bg-slate-200/50 rounded-3xl p-6 h-fit">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2 text-slate-600">
              <CheckCircle2 className="text-slate-500" /> آخر الطلبات المنتهية
            </h2>
            <div className="space-y-3">
              {archivedOrders.slice(0, 10).map(order => (
                <div key={order.id} className="bg-white/80 rounded-xl p-3 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-black text-slate-700">طاولة {order.tableNumber}</span>
                    <p className="text-[10px] text-slate-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="font-bold text-slate-600">€{Number(order.total).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
