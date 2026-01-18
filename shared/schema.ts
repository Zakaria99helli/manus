import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, jsonb, decimal, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// 1. جدول المستخدمين (الأدمن والموظفين)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("staff"), // owner, manager, staff
  isAdmin: text("is_admin").default("false"),
});

// 2. جدول الطلبات (تم تعديله ليناسب الطاولات)
export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  tableNumber: text("table_number").notNull(), // رقم الطاولة اللي أرسلت الطلب
  items: jsonb("items").notNull(), // مصفوفة تحتوي الوجبات + الإضافات والمحذوفات
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  status: text("status").default("pending"), // pending, preparing, completed, cancelled
  archived: boolean("archived").default(false), // لأرشفة الطلبات المنتهية
  createdAt: timestamp("created_at").defaultNow(),
});

// مخططات التحقق (Schemas)
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  role: true,
});

// تحديث الـ Schema ليقبل رقم الطاولة ويترك الباقي للسيرفر
export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  status: true,
  createdAt: true,
  archived: true,
});

// الأنواع (Types) لسهولة الاستخدام في الكود
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
