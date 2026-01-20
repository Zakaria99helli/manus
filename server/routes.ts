import express, { type Request, type Response, type Express } from "express";
import { createServer } from "http";
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
} from "../shared/schema"; // تم تعديل المسار هنا فقط من @shared إلى ../shared
import { eq } from "drizzle-orm";

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
router.patch("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const [user] = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
});

// Delete user
router.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [user] = await db.delete(users).where(eq(users.id, id)).returning();
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ message: "User deleted" });
});

// ---------------------
// --- Menu Items CRUD ---
// ---------------------

// Get all menu items
router.get("/menu-items", async (req: Request, res: Response) => {
  const items = await db.select().from(menuItems);
  res.json(items);
});

// Get menu item by ID
router.get("/menu-items/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [item] = await db.select().from(menuItems).where(eq(menuItems.id, parseInt(id)));
  if (!item) return res.status(404).json({ error: "Menu item not found" });
  res.json(item);
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
  const updateData = req.body;
  const [item] = await db.update(menuItems).set(updateData).where(eq(menuItems.id, parseInt(id))).returning();
  if (!item) return res.status(404).json({ error: "Menu item not found" });
  res.json(item);
});

// Delete menu item
router.delete("/menu-items/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [item] = await db.delete(menuItems).where(eq(menuItems.id, parseInt(id))).returning();
  if (!item) return res.status(404).json({ error: "Menu item not found" });
  res.json({ message: "Menu item deleted" });
});

// ---------------------
// --- Menu Options CRUD ---
// ---------------------

// Get all options for a menu item
router.get("/menu-items/:menuItemId/options", async (req: Request, res: Response) => {
  const { menuItemId } = req.params;
  const options = await db.select().from(menuOptions).where(eq(menuOptions.menuItemId, parseInt(menuItemId)));
  res.json(options);
});

// Create option for a menu item
router.post("/menu-items/:menuItemId/options", async (req: Request, res: Response) => {
  const { menuItemId } = req.params;
  const optionData: Omit<InsertMenuOption, 'menuItemId'> = req.body;
  const [option] = await db.insert(menuOptions).values({ ...optionData, menuItemId: parseInt(menuItemId) }).returning();
  res.json(option);
});

// Update option
router.put("/menu-options/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const [option] = await db.update(menuOptions).set(updateData).where(eq(menuOptions.id, parseInt(id))).returning();
  if (!option) return res.status(404).json({ error: "Menu option not found" });
  res.json(option);
});

// Delete option
router.delete("/menu-options/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [option] = await db.delete(menuOptions).where(eq(menuOptions.id, parseInt(id))).returning();
  if (!option) return res.status(404).json({ error: "Menu option not found" });
  res.json({ message: "Menu option deleted" });
});

// ---------------------
// --- Orders CRUD ---
// ---------------------

// Get all active orders
router.get("/orders", async (req: Request, res: Response) => {
  const activeOrders = await db.select().from(orders).where(eq(orders.archived, false));
  res.json(activeOrders);
});

// Get archived orders
router.get("/orders/archived", async (req: Request, res: Response) => {
  const archivedOrders = await db.select().from(orders).where(eq(orders.archived, true));
  res.json(archivedOrders);
});

// Get order by ID
router.get("/orders/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [order] = await db.select().from(orders).where(eq(orders.id, id));
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Create order (تعديل طفيف ليدعم tableNumber بدلاً من العنوان)
router.post("/orders", async (req: Request, res: Response) => {
  try {
    const orderData: InsertOrder = {
      ...req.body,
      total: req.body.total.toString(),
      status: "pending",
      archived: false
    };
    const [order] = await db.insert(orders).values(orderData).returning();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to create order" });
  }
});

// Update order status
router.patch("/orders/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const [order] = await db.update(orders).set({ status }).where(eq(orders.id, id)).returning();
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// Archive order (تغيير POST ليتوافق مع استدعاء صفحة Admin)
router.post("/orders/:id/archive", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [order] = await db.update(orders).set({ archived: true }).where(eq(orders.id, id)).returning();
  if (!order) return res.status(404).json({ error: "Order not found" });
  res.json(order);
});

// --- Auth Routes ---
router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const [user] = await db.select().from(users).where(eq(users.username, username));
  if (!user || user.password !== password) return res.status(401).json({ error: "Invalid credentials" });
  res.json(user);
});

router.post("/logout", (req, res) => {
  res.json({ message: "Logged out" });
});

// ---------------------
// --- Register Routes Function ---
// ---------------------
export default function registerRoutes(app: Express) {
  app.use("/api", router);
  const httpServer = createServer(app);
  return httpServer;
}
