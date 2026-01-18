import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MenuItem } from '@/data/menu';
import { setMenuToFirebase, subscribeMenuFromFirebase } from '@/lib/firebase-menu';
import { useToast } from "@/hooks/use-toast"; // إضافة التنبيهات

export default function MenuAdminPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Partial<MenuItem>>({});
  const { toast } = useToast();

  useEffect(() => {
    // جلب المنيو من Firebase للتحديث اللحظي
    const unsub = subscribeMenuFromFirebase(setMenu);
    // جلب المنيو من قاعدة بيانات نيون عند تحميل الصفحة
    fetch('/api/menu').then(r => r.json()).then(setMenu);
    return unsub;
  }, []);

  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setForm(item);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // صعود تلقائي للفورم عند التعديل
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
      try {
        await fetch(`/api/menu/${id}`, { method: 'DELETE' }); // الحذف من نيون
        const newMenu = menu.filter(i => i.id !== id);
        setMenu(newMenu);
        await setMenuToFirebase(newMenu); // التحديث في Firebase
        toast({ title: "تم الحذف بنجاح" });
      } catch (error) {
        toast({ title: "فشل الحذف", variant: "destructive" });
      }
    }
  };

  const handleSave = async () => {
    let newMenu;
    try {
      if (editing) {
        // تحديث صنف موجود
        await fetch(`/api/menu/${editing.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        newMenu = menu.map(i => i.id === editing.id ? { ...i, ...form } as MenuItem : i);
        toast({ title: "تم تحديث الصنف بنجاح" });
      } else {
        // إضافة صنف جديد
        const res = await fetch('/api/menu', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
        const newItem = await res.json();
        newMenu = [...menu, newItem];
        toast({ title: "تمت إضافة الصنف بنجاح" });
      }
      
      setMenu(newMenu);
      await setMenuToFirebase(newMenu); // مزامنة مع هواتف الزبائن
      setEditing(null);
      setForm({});
    } catch (error) {
      toast({ title: "حدث خطأ أثناء الحفظ", variant: "destructive" });
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg my-10">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">إدارة قائمة الطعام</h1>
      
      <div className="grid grid-cols-1 gap-4 mb-8 p-4 border rounded-md bg-gray-50">
        <h2 className="font-semibold text-lg">{editing ? 'تعديل الصنف الحالي' : 'إضافة صنف جديد'}</h2>
        
        <Input 
          placeholder="اسم الصنف بالعربي" 
          value={typeof form.name === 'object' ? form.name?.ar || '' : form.name || ''} 
          onChange={e => setForm(f => ({
            ...f,
            name: {
              ar: e.target.value,
              en: (typeof f.name === 'object' && f.name?.en) || '',
              fr: (typeof f.name === 'object' && f.name?.fr) || ''
            }
          }))} 
        />

        <Textarea 
          placeholder="وصف الصنف بالعربي" 
          value={typeof form.description === 'object' ? form.description?.ar || '' : form.description || ''} 
          onChange={e => setForm(f => ({
            ...f,
            description: {
              ar: e.target.value,
              en: (typeof f.description === 'object' && f.description?.en) || '',
              fr: (typeof f.description === 'object' && f.description?.fr) || ''
            }
          }))} 
        />

        <div className="grid grid-cols-2 gap-4">
          <Input 
            placeholder="السعر" 
            type="number" 
            value={form.price as any || ''} 
            onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} 
          />
          {/* خانة رابط الصورة الجديدة */}
          <Input 
            placeholder="رابط صورة الوجبة (URL)" 
            value={form.image || ''} 
            onChange={e => setForm(f => ({ ...f, image: e.target.value }))} 
          />
        </div>

        <div className="flex gap-2 mt-2">
          <Button className="flex-1" onClick={handleSave}>{editing ? 'تحديث البيانات' : 'إضافة للمنيو'}</Button>
          {editing && <Button variant="outline" onClick={() => { setEditing(null); setForm({}); }}>إلغاء</Button>}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-primary text-white">
              <th className="p-3 border text-right">الصورة</th>
              <th className="p-3 border text-right">الاسم</th>
              <th className="p-3 border text-right">السعر</th>
              <th className="p-3 border text-center">إجراءات</th>
            </tr>
          </thead>
          <tbody>
            {menu.map(item => (
              <tr key={item.id} className="border-b hover:bg-gray-100 transition-colors">
                <td className="p-2 border text-center">
                  {item.image ? <img src={item.image} alt="" className="w-12 h-12 rounded object-cover mx-auto" /> : 'بدون صورة'}
                </td>
                <td className="p-2 border font-medium">
                  {typeof item.name === 'string' ? item.name : item.name?.ar || item.name?.en}
                </td>
                <td className="p-2 border">{item.price} €</td>
                <td className="p-2 border text-center space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>تعديل</Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>حذف</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
