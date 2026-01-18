import { users, orders, menuItems, type User, type InsertUser, type Order, type InsertOrder, type MenuItem, type InsertMenuItem } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<void>;

  // Menu operations (هذه الإضافات التي كانت تنقصك)
  getMenuItems(): Promise<MenuItem[]>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  updateMenuItem(id: string, item: Partial<MenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<void>;

  // Order operations
  getOrders(): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  archiveOrder(id: string): Promise<Order | undefined>;
  getArchivedOrders(): Promise<Order[]>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  // --- User Operations ---
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, update: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set(update).where(eq(users.id, parseInt(id))).returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, parseInt(id)));
  }

  // --- Menu Operations (تم تفعيلها الآن) ---
  async getMenuItems(): Promise<MenuItem[]> {
    return await db.select().from(menuItems);
  }

  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [newItem] = await db.insert(menuItems).values(item).returning();
    return newItem;
  }

  async updateMenuItem(id: string, update: Partial<MenuItem>): Promise<MenuItem | undefined> {
    const [updated] = await db.update(menuItems).set(update).where(eq(menuItems.id, parseInt(id))).returning();
    return updated;
  }

  async deleteMenuItem(id: string): Promise<void> {
    await db.delete(menuItems).where(eq(menuItems.id, parseInt(id)));
  }

  // --- Order Operations ---
  async getOrders(): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.archived, false));
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const [order] = await db.insert(orders).values(insertOrder).returning();
    return order;
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ status }).where(eq(orders.id, parseInt(id))).returning();
    return order;
  }

  async archiveOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.update(orders).set({ archived: true }).where(eq(orders.id, parseInt(id))).returning();
    return order;
  }

  async getArchivedOrders(): Promise<Order[]> {
    return await db.select().from(orders).where(eq(orders.archived, true));
  }
}

export const storage = new DatabaseStorage();
