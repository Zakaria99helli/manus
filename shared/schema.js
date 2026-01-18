"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertOrderSchema = exports.insertUserSchema = exports.orders = exports.users = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_zod_1 = require("drizzle-zod");
const pg_core_2 = require("drizzle-orm/pg-core");
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    username: (0, pg_core_1.text)("username").notNull().unique(),
    password: (0, pg_core_1.text)("password").notNull(),
    // Role: 'owner', 'manager', 'staff', 'admin' (default: 'staff')
    role: (0, pg_core_1.text)("role").default("staff"),
    // Deprecated: isAdmin
    isAdmin: (0, pg_core_1.text)("is_admin").default("false"),
});
exports.orders = (0, pg_core_1.pgTable)("orders", {
    id: (0, pg_core_1.varchar)("id").primaryKey().default((0, drizzle_orm_1.sql) `gen_random_uuid()`),
    customerName: (0, pg_core_1.text)("customer_name").notNull(),
    customerPhone: (0, pg_core_1.text)("customer_phone").notNull(),
    customerAddress: (0, pg_core_1.text)("customer_address").notNull(),
    items: (0, pg_core_2.jsonb)("items").notNull(), // Array of {id, quantity, price}
    total: (0, pg_core_2.decimal)("total", { precision: 10, scale: 2 }).notNull(),
    status: (0, pg_core_1.text)("status").default("pending"), // pending, completed, cancelled
    createdAt: (0, pg_core_2.timestamp)("created_at").defaultNow(),
});
exports.insertUserSchema = (0, drizzle_zod_1.createInsertSchema)(exports.users).pick({
    username: true,
    password: true,
    role: true,
});
exports.insertOrderSchema = (0, drizzle_zod_1.createInsertSchema)(exports.orders).omit({
    id: true,
    status: true,
    createdAt: true,
});
