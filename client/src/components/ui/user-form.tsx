import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import * as SelectPrimitive from '@radix-ui/react-select';
import { Check, ChevronDown } from 'lucide-react'; // اختياري: لإضافة أيقونات إذا كنت تستخدم lucide-react

export type UserRole = 'manager' | 'assistant' | 'admin';

export interface UserPermission {
  key: string;
  label: string;
}

export const USER_PERMISSIONS: UserPermission[] = [
  { key: 'view_orders', label: 'عرض الطلبات' },
  { key: 'edit_orders', label: 'تعديل الطلبات' },
  { key: 'manage_menu', label: 'إدارة المنيو' },
  { key: 'manage_inventory', label: 'إدارة المخزون' },
  { key: 'manage_users', label: 'إدارة المستخدمين' },
  { key: 'view_reports', label: 'عرض التقارير' },
];

export interface UserFormProps {
  onSubmit: (data: {
    username: string;
    password: string;
    role: UserRole;
    permissions: string[];
  }) => void;
  initial?: {
    username?: string;
    password?: string;
    role?: UserRole;
    permissions?: string[];
  };
  submitLabel?: string;
}

export function UserForm({ onSubmit, initial, submitLabel = 'إضافة' }: UserFormProps) {
  const [username, setUsername] = React.useState(initial?.username || '');
  const [password, setPassword] = React.useState(initial?.password || '');
  const [role, setRole] = React.useState<UserRole>(initial?.role || 'manager');
  const [permissions, setPermissions] = React.useState<string[]>(initial?.permissions || []);

  const handlePermissionChange = (perm: string) => {
    setPermissions((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ username, password, role, permissions });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
      <div>
        <label className="block mb-1 font-bold">اسم المستخدم</label>
        <Input value={username} onChange={e => setUsername(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 font-bold">كلمة السر</label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
      </div>
      <div>
        <label className="block mb-1 font-bold">الدور</label>
        
        {/* تم تعديل هذا الجزء */}
        <SelectPrimitive.Root 
            value={role} 
            onValueChange={(val) => setRole(val as UserRole)}
        >
          <SelectPrimitive.Trigger className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
            <SelectPrimitive.Value placeholder="اختر الدور" />
            <SelectPrimitive.Icon>
                <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>

          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white text-popover-foreground shadow-md animate-in fade-in-80">
              <SelectPrimitive.Viewport className="p-1">
                <SelectItem value="manager">مسؤول صالة</SelectItem>
                <SelectItem value="assistant">مساعد مسؤول</SelectItem>
                <SelectItem value="admin">أدمن عادي</SelectItem>
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      </div>

      <div>
        <label className="block mb-1 font-bold">الصلاحيات</label>
        <div className="grid grid-cols-2 gap-2">
          {USER_PERMISSIONS.map((perm) => (
            <label key={perm.key} className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                checked={permissions.includes(perm.key)} 
                onCheckedChange={() => handlePermissionChange(perm.key)} 
              />
              <span className="text-sm">{perm.label}</span>
            </label>
          ))}
        </div>
      </div>
      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  );
}

// مكون مساعد صغير لترتيب شكل عناصر القائمة
const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, className, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={`relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-gray-100 ${className}`}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});
SelectItem.displayName = "SelectItem"