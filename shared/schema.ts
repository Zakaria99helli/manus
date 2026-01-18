import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ---------------------
// 1️⃣ جدول المستخدمين (الأدمن والموظفين)
// ---------------------
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("staff"), // owner, manager, staff
  isAdmin: boolean("is_admin").default(false),
});

// ---------------------
// 2️⃣ جدول الأصناف (Menu Items) - يدعم الصور والإضافات
// ---------------------
export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  category: text("category").notNull(), // سندويش / صحن / مشروب
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  available: boolean("available").default(true),
  imageUrl: text("image_url").default(""), // رابط الصورة
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------------------
// 3️⃣ جدول خيارات الأصناف (إضافات/صوص/خضار)
// ---------------------
export const menuOptions = pgTable("menu_options", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menuItemId: varchar("menu_item_id").notNull(),
  name: text("name").notNull(),
  extraPrice: decimal("extra_price", { precision: 10, scale: 2 }).default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------------------
// 4️⃣ جدول الطلبات
// ---------------------
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tableNumber: text("table_number").notNull(), // رقم الطاولة
  items: jsonb("items").notNull(), // مصفوفة تحتوي الوجبات + الإضافات والمحذوفات
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, preparing, completed, cancelled
  archived: boolean("archived").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// ---------------------
// 5️⃣ TypeScript - structure واضحة للـ JSON
// ---------------------
export type OrderItem = {
  menuItemId: string;
  quantity: number;
  options?: string[]; // أسماء الخيارات المختارة
  removes?: string[]; // أسماء الأشياء المحذوفة
};

export type OrderJSON = OrderItem[];

// ---------------------
// 6️⃣ Schemas للتحقق
// ---------------------
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
  createdAt: true,
});

export const insertMenuOptionSchema = createInsertSchema(menuOptions).omit({
  id: true,
  createdAt: true,
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  status: true,
  createdAt: true,
  archived: true,
});

// ---------------------
// 7️⃣ Types للـ TS
// ---------------------
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

export type InsertMenuOption = z.infer<typeof insertMenuOptionSchema>;
export type MenuOption = typeof menuOptions.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
