import express, { Request, Response } from "express";
import { db } from "./db";
import {
  users,
  orders,
  menuItems,
  menuOptions,
  type User,
  type InsertUser,
  type Order,
  type InsertOrder,
  type MenuItem,
  type InsertMenuItem,
  type MenuOption,
  type InsertMenuOption,
  type OrderItem,
  type OrderJSON
} from "@shared/schema";
import { eq, inArray } from "drizzle-orm";

const router = express.Router();

// ---------------------
// --- Users CRUD ---
// ---------------------

// Get all users
router.get("/users", async (req: Request, res: Response) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

// Get user by ID
router.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [user] = await db.select().from(users).where(eq(users.id, id));
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Create user
router.post("/users", async (req: Request, res: Response) => {
  const userData: InsertUser = req.body;
  const [user] = await db.insert(users).values(userData).returning();
  res.json(user);
});

// Update user
router.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: Partial<User> = req.body;
  const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Delete user
router.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(users).where(eq(users.id, id));
  res.json({ success: true });
});

// ---------------------
// --- Menu Items CRUD ---
// ---------------------

// Get all menu items
router.get("/menu-items", async (_req: Request, res: Response) => {
  const items = await db.select().from(menuItems);
  res.json(items);
});

// Create menu item
router.post("/menu-items", async (req: Request, res: Response) => {
  const itemData: InsertMenuItem = req.body;
  const [item] = await db.insert(menuItems).values(itemData).returning();
  res.json(item);
});

// Update menu item
router.put("/menu-items/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: Partial<MenuItem> = req.body;
  const [item] = await db.update(menuItems).set(updateData).where(eq(menuItems.id, id)).returning();
  if (!item) return res.status(404).json({ error: "Menu item not found" });
  res.json(item);
});

// Delete menu item
router.delete("/menu-items/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(menuItems).where(eq(menuItems.id, id));
  res.json({ success: true });
});

// ---------------------
// --- Menu Options CRUD ---
// ---------------------

// Get options for a menu item
router.get("/menu-items/:id/options", async (req: Request, res: Response) => {
  const { id } = req.params;
  const options = await db.select().from(menuOptions).where(eq(menuOptions.menuItemId, id));
  res.json(options);
});

// Create menu option
router.post("/menu-items/:id/options", async (req: Request, res: Response) => {
  const { id } = req.params;
  const optionData: InsertMenuOption = { ...req.body, menuItemId: id };
  const [option] = await db.insert(menuOptions).values(optionData).returning();
  res.json(option);
});

// Update menu option
router.put("/options/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData: Partial<MenuOption> = req.body;
  const [option] = await db.update(menuOptions).set(updateData).where(eq(menuOptions.id, id)).returning();
  if (!option) return res.status(404).json({ error: "Option not found" });
  res.json(option);
});

// Delete menu option
router.delete("/options/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(menuOptions).where(eq(menuOptions.id, id));
  res.json({ success: true });
});

// ---------------------
// --- Orders CRUD ---
// ---------------------

// Get all active orders
router.get("/orders", async (_req: Request, res: Response) => {
  const activeOrders = await db.select().from(orders).where(eq(orders.archived, false));
  res.json(activeOrders);
});

// Get all archived orders
router.get("/orders/archived", async (_req: Request, res: Response) => {
  const archivedOrders = await db.select().from(orders).where(eq(orders.archived, true));
  res.json(archivedOrders);
});

// Create order
router.post("/orders", async (req: Request, res: Response) => {
  const orderData: InsertOrder = req.body;

  // Optionally: validate OrderJSON
  const items: OrderJSON = orderData.items as OrderJSON;
  const menuItemIds = items.map(i => i.menuItemId);
  const existingItems = await db.select().from(menuItems).where(inArray(menuItems.id, menuItemIds));
  if (existingItems.length !== menuItemIds.length) {
    return res.status(400).json({ error: "One or more menu items not found" });
  }

  const [order] = await db.insert(orders).values(orderData).returning();
  res.json(order);
});

// Update order status
router.put("/orders/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Archive order
router.put("/orders/:id/archive", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [order] = await db.update(orders).set({ archived: true }).where(eq(orders.id, id)).returning();
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

export default router;
