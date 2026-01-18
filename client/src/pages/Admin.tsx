import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserForm, USER_PERMISSIONS } from '@/components/ui/user-form';
import { RefreshCcw, LogOut, Bell, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/store/cart';
import { cn } from '@/lib/utils';

export default function Admin() {
  interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    name: { en: string; fr: string; ar: string };
    selectedExtras?: string[];
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
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const handleUserSubmit = async (data: { username: string; password: string; role: string; permissions: string[] }) => {
    try {
      if (editUser) {
        await fetch(`/api/users/${editUser.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      setShowUserForm(false);
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Failed to submit user:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف المستخدم؟')) {
      try {
        await fetch(`/api/users/${id}`, { method: 'DELETE' });
        fetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
      const archivedRes = await fetch('/api/orders/archived');
      if (archivedRes.ok) {
        const archivedData = await archivedRes.json();
        setArchivedOrders(archivedData);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrders();
      const interval = setInterval(fetchOrders, 5000);
      if (user.role === 'owner' || user.role === 'manager') fetchUsers();
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    if (orders.length > prevOrdersCount.current) {
      audioRef.current?.play().catch(e => console.log('Audio play failed:', e));
    }
    prevOrdersCount.current = orders.length;
  }, [orders]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      setUsername('');
      setPassword('');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const archiveOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/archive`, {
        method: 'POST',
      });
      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Failed to archive order:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center p-4 font-poppins">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600 mb-6">Damas Food Restaurant</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
              <Input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full text-lg py-6 font-bold" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-6 text-center">Default credentials: admin / admin123</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-gray-100", language === 'ar' ? "font-cairo" : "font-poppins")} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      <audio ref={audioRef} src="https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae5c7.mp3" preload="auto" />
      
      <div className="bg-white shadow-sm border-b p-4 flex flex-col md:flex-row justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {language === 'ar' ? 'نظام عرض المطبخ' : 'Kitchen Display System'}
            </h1>
            <p className="text-xs text-gray-500">
              {language === 'ar' ? `مرحباً، ${user.username}` : `Welcome, ${user.username}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button variant="outline" size="sm" onClick={fetchOrders}>
            <RefreshCcw className="w-4 h-4 mr-2" /> {language === 'ar' ? 'تحديث' : 'Refresh'}
          </Button>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> {language === 'ar' ? 'خروج' : 'Logout'}
          </Button>
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        {(user.role === 'owner' || user.role === 'manager') && (
          <div className="mb-8 bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">{language === 'ar' ? 'إدارة المستخدمين' : 'User Management'}</h2>
              <Button onClick={() => { setShowUserForm(true); setEditUser(null); }}>
                {language === 'ar' ? 'إضافة مستخدم' : 'Add User'}
              </Button>
            </div>
            
            {showUserForm && (
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <UserForm
                  onSubmit={handleUserSubmit}
                  initial={editUser ? {
                    username: editUser.username,
                    password: '',
                    role: editUser.role,
                    permissions: editUser.permissions || [],
                  } : undefined}
                  submitLabel={editUser ? (language === 'ar' ? 'تعديل' : 'Update') : (language === 'ar' ? 'إضافة' : 'Add')}
                />
                <Button variant="ghost" className="mt-2" onClick={() => { setShowUserForm(false); setEditUser(null); }}>
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-sm text-right">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="p-3">{language === 'ar' ? 'اسم المستخدم' : 'Username'}</th>
                    <th className="p-3">{language === 'ar' ? 'الدور' : 'Role'}</th>
                    <th className="p-3">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{u.username}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3 flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => { setEditUser(u); setShowUserForm(true); }}>
                          {language === 'ar' ? 'تعديل' : 'Edit'}
                        </Button>
                        {u.role !== 'owner' && (
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.id)}>
                            {language === 'ar' ? 'حذف' : 'Delete'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Bell className="text-primary" /> {language === 'ar' ? 'الطلبات النشطة' : 'Active Orders'}
            </h2>
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-gray-500 text-center py-8 bg-white rounded-xl border">{language === 'ar' ? 'لا توجد طلبات حالياً' : 'No active orders'}</p>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm border p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="text-lg font-bold text-primary">#{order.tableNumber}</span>
                        <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                            {language === 'ar' ? 'إكمال' : 'Complete'}
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => archiveOrder(order.id)}>
                          {language === 'ar' ? 'أرشفة' : 'Archive'}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.name[language as keyof typeof item.name]}</span>
                          <span className="text-gray-500">€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t flex justify-between font-bold">
                      <span>{language === 'ar' ? 'المجموع' : 'Total'}</span>
                      <span>€{Number(order.total).toFixed(2)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CheckCircle2 className="text-green-500" /> {language === 'ar' ? 'الطلبات المؤرشفة' : 'Archived Orders'}
            </h2>
            <div className="space-y-4 opacity-75">
              {archivedOrders.map(order => (
                <div key={order.id} className="bg-gray-50 rounded-xl border p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-bold">#{order.tableNumber}</span>
                    <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.items.length} {language === 'ar' ? 'عناصر' : 'items'} - €{Number(order.total).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
