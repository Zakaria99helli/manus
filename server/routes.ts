import express, { type Request, type Response, type Express } from "express";
import { createServer } from "http";
import { db } from "./db";
import {
  users,
  orders,
  menuItems,
  type User,
  type InsertUser,
  type Order,
  type InsertOrder,
  type MenuItem,
  type InsertMenuItem,
} from "../shared/schema"; // تم إصلاح المسار هنا
import { eq, and } from "drizzle-orm";

const router = express.Router();

// ---------------------
// --- Users CRUD ---
// ---------------------

router.get("/users", async (_req: Request, res: Response) => {
  const allUsers = await db.select().from(users);
  res.json(allUsers);
});

router.post("/users", async (req: Request, res: Response) => {
  const [user] = await db.insert(users).values(req.body).returning();
  res.json(user);
});

router.patch("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [user] = await db.update(users).set(req.body).where(eq(users.id, id)).returning();
  res.json(user);
});

router.delete("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await db.delete(users).where(eq(users.id, id));
  res.json({ message: "User deleted" });
});

// ---------------------
// --- Menu Items ---
// ---------------------

router.get("/menu-items", async (_req: Request, res: Response) => {
  const items = await db.select().from(menuItems);
  res.json(items);
});

// ---------------------
// --- Orders CRUD ---
// ---------------------

// جلب الطلبات النشطة (غير المؤرشفة)
router.get("/orders", async (_req: Request, res: Response) => {
  const allOrders = await db.select()
    .from(orders)
    .where(eq(orders.archived, false));
  res.json(allOrders);
});

// جلب الطلبات المؤرشفة
router.get("/orders/archived", async (_req: Request, res: Response) => {
  const archived = await db.select()
    .from(orders)
    .where(eq(orders.archived, true));
  res.json(archived);
});

// إنشاء طلب جديد (متوافق مع نظام الطاولات)
router.post("/orders", async (req: Request, res: Response) => {
  try {
    const orderData: InsertOrder = {
      tableNumber: req.body.tableNumber,
      items: req.body.items,
      total: req.body.total.toString(),
    };
    const [order] = await db.insert(orders).values(orderData).returning();
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: "Failed to create order" });
  }
});

// تحديث حالة الطلب (قيد التحضير، مكتمل...)
router.patch("/orders/:id/status", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const [order] = await db.update(orders)
    .set({ status })
    .where(eq(orders.id, id))
    .returning();
  res.json(order);
});

// أرشفة الطلب (تم تغييرها لـ POST لتطابق كود الـ Admin)
router.post("/orders/:id/archive", async (req: Request, res: Response) => {
  const { id } = req.params;
  const [order] = await db.update(orders)
    .set({ archived: true })
    .where(eq(orders.id, id))
    .returning();
  res.json(order);
});

// ---------------------
// --- Auth Routes ---
// ---------------------

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const [user] = await db.select().from(users).where(eq(users.username, username));
  
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  
  // لغايات التجربة سنعيد بيانات المستخدم، في الإنتاج يجب استخدام JWT/Session
  res.json(user);
});

router.get("/user", async (_req: Request, res: Response) => {
  // هذا الـ endpoint لغايات فحص تسجيل الدخول
  res.status(401).json({ message: "Not authenticated" });
});

router.post("/logout", (_req, res) => {
  res.json({ message: "Logged out" });
});

// ---------------------
// --- Register ---
// ---------------------
export default function registerRoutes(app: Express) {
  app.use("/api", router);
  const httpServer = createServer(app);
  return httpServer;
}
