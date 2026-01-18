import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export default function InventoryAdminPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [form, setForm] = useState<Partial<InventoryItem>>({});
  const [editing, setEditing] = useState<InventoryItem | null>(null);

  useEffect(() => {
    fetch('/api/inventory').then(r => r.json()).then(setItems);
  }, []);

  const handleEdit = (item: InventoryItem) => {
    setEditing(item);
    setForm(item);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المخزون؟')) {
      await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleSave = async () => {
    if (editing) {
      await fetch(`/api/inventory/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setItems(items.map(i => i.id === editing.id ? { ...i, ...form } as InventoryItem : i));
      setEditing(null);
      setForm({});
    } else {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const newItem = await res.json();
      setItems([...items, newItem]);
      setForm({});
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">إدارة المخزون</h1>
      <div className="mb-6">
        <Input placeholder="اسم المادة" value={form.name || ''} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <Input placeholder="الكمية" type="number" value={form.quantity || ''} onChange={e => setForm(f => ({ ...f, quantity: parseFloat(e.target.value) }))} />
        <Input placeholder="الوحدة (كغ/علبة/...)" value={form.unit || ''} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} />
        <Button className="mt-2" onClick={handleSave}>{editing ? 'تعديل' : 'إضافة'}</Button>
        {editing && <Button variant="outline" className="ml-2" onClick={() => { setEditing(null); setForm({}); }}>إلغاء</Button>}
      </div>
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">الاسم</th>
            <th className="p-2 border">الكمية</th>
            <th className="p-2 border">الوحدة</th>
            <th className="p-2 border">إجراءات</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b">
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.quantity}</td>
              <td className="p-2 border">{item.unit}</td>
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
