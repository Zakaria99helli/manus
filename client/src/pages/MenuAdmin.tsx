import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MenuItem } from '@/data/menu';
import { setMenuToFirebase, subscribeMenuFromFirebase } from '@/lib/firebase-menu';

export default function MenuAdminPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Partial<MenuItem>>({});

  useEffect(() => {
    const unsub = subscribeMenuFromFirebase(setMenu);
    fetch('/api/menu').then(r => r.json()).then(setMenu);
    return unsub;
  }, []);

  const handleEdit = (item: MenuItem) => {
    setEditing(item);
    setForm(item);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الصنف؟')) {
      await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      const newMenu = menu.filter(i => i.id !== id);
      setMenu(newMenu);
      await setMenuToFirebase(newMenu);
    }
  };

  const handleSave = async () => {
    let newMenu;
    if (editing) {
      await fetch(`/api/menu/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      newMenu = menu.map(i => i.id === editing.id ? { ...i, ...form } as MenuItem : i);
      setMenu(newMenu);
      setEditing(null);
      setForm({});
    } else {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const newItem = await res.json();
      newMenu = [...menu, newItem];
      setMenu(newMenu);
      setForm({});
    }
    await setMenuToFirebase(newMenu);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">إدارة المنيو</h1>
      <div className="mb-6">
        <Input placeholder="اسم الصنف" value={typeof form.name === 'object' ? form.name?.ar || '' : form.name || ''} onChange={e => setForm(f => ({
          ...f,
          name: {
            ar: e.target.value,
            en: (typeof f.name === 'object' && f.name?.en) || '',
            fr: (typeof f.name === 'object' && f.name?.fr) || ''
          }
        }))} />
        <Textarea placeholder="الوصف" value={typeof form.description === 'object' ? form.description?.ar || '' : form.description || ''} onChange={e => setForm(f => ({
          ...f,
          description: {
            ar: e.target.value,
            en: (typeof f.description === 'object' && f.description?.en) || '',
            fr: (typeof f.description === 'object' && f.description?.fr) || ''
          }
        }))} />
        <Input placeholder="السعر" type="number" value={form.price as any || ''} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) }))} />
        <Button className="mt-2" onClick={handleSave}>{editing ? 'تعديل' : 'إضافة'}</Button>
        {editing && <Button variant="outline" className="ml-2" onClick={() => { setEditing(null); setForm({}); }}>إلغاء</Button>}
      </div>
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">الاسم</th>
            <th className="p-2 border">الوصف</th>
            <th className="p-2 border">السعر</th>
            <th className="p-2 border">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {menu.map(item => (
            <tr key={item.id} className="border-b">
              <td className="p-2 border">{typeof item.name === 'string' ? item.name : item.name?.ar || item.name?.en}</td>
              <td className="p-2 border">{typeof item.description === 'string' ? item.description : item.description?.ar || item.description?.en}</td>
              <td className="p-2 border">{item.price}</td>
              <td className="p-2 border">
                <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>تعديل</Button>
                <Button size="sm" variant="destructive" className="ml-2" onClick={() => handleDelete(item.id)}>حذف</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
