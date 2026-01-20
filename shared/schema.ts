import { pgTable, varchar, text, timestamp, decimal, boolean, jsonb, integer, serial } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Menu Items table
export const menuItems = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }),
  description: text("description"),
  descriptionAr: text("description_ar"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default(sql`0`),
  category: varchar("category", { length: 100 }).notNull(),
  categoryAr: varchar("category_ar", { length: 100 }),
  imageUrl: text("image_url"),
  available: boolean("available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Menu Options (Extras/Add-ons) table
export const menuOptions = pgTable("menu_options", {
  id: serial("id").primaryKey(),
  menuItemId: integer("menu_item_id").notNull().references(() => menuItems.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  nameAr: varchar("name_ar", { length: 255 }),
  extraPrice: decimal("extra_price", { precision: 10, scale: 2 }).default(sql`0`).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Tables table (restaurant tables with QR codes)
export const tables = pgTable("tables", {
  id: serial("id").primaryKey(),
  tableNumber: varchar("table_number", { length: 50 }).notNull().unique(),
  qrCode: text("qr_code").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Orders table
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  tableId: integer("table_id").notNull().references(() => tables.id),
  items: jsonb("items").notNull(),
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull().default(sql`0`),
  status: varchar("status", { length: 50 }).default("pending").notNull(),
  notes: text("notes"),
  archived: boolean("archived").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type MenuItem = typeof menuItems.$inferSelect;
export type InsertMenuItem = typeof menuItems.$inferInsert;

export type MenuOption = typeof menuOptions.$inferSelect;
export type InsertMenuOption = typeof menuOptions.$inferInsert;

export type Table = typeof tables.$inferSelect;
export type InsertTable = typeof tables.$inferInsert;

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

// Order item structure for JSON
export interface OrderItem {
  menuItemId: number;
  name: string;
  quantity: number;
  price: number;
  options?: {
    id: number;
    name: string;
    extraPrice: number;
  }[];
}

export type OrderJSON = OrderItem[];
