import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertOrderSchema } from "../shared/schema";
import { ZodError } from "zod";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Helper for manager access
  function requireManager(req: any, res: any, next: any) {
    if (!req.isAuthenticated?.()) return res.sendStatus(401);
    if (req.user.role === 'owner' || req.user.role === 'manager') return next();
    return res.sendStatus(403);
  }

  // --- User Management API ---
  app.get('/api/users', requireManager, async (req, res) => {
    const users = await storage.getUsers();
    res.json(users);
  });

  app.post('/api/users', requireManager, async (req, res) => {
    const { username, password, role } = req.body;
    if (!username || !password || !role) return res.status(400).json({ message: 'Missing fields' });
    const exists = await storage.getUserByUsername(username);
    if (exists) return res.status(409).json({ message: 'Username exists' });
    const user = await storage.createUser(req.body);
    res.status(201).json(user);
  });

  app.patch('/api/users/:id', requireManager, async (req, res) => {
    const updated = await storage.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  });

  app.delete('/api/users/:id', requireManager, async (req, res) => {
    const user = await storage.getUser(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'owner') return res.status(403).json({ message: 'Cannot delete owner' });
    await storage.deleteUser(req.params.id);
    res.json({ message: 'User deleted' });
  });

  // --- Orders API ---
  app.get("/api/orders", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const orders = await storage.getOrders();
    res.json(orders);
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(orderData);
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid order data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });
    const updatedOrder = await storage.updateOrderStatus(req.params.id, status);
    if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
    res.json(updatedOrder);
  });

  app.post("/api/orders/:id/archive", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const archived = await storage.archiveOrder(req.params.id);
    if (!archived) return res.status(404).json({ message: "Order not found" });
    res.json({ message: "Order archived", order: archived });
  });

  app.get("/api/orders/archived", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const archivedOrders = await storage.getArchivedOrders();
    res.json(archivedOrders);
  });

  // Create default admin
  (async () => {
    const admin = await storage.getUserByUsername("admin");
    if (!admin) {
      await storage.createUser({
        username: "admin",
        password: "admin123",
        role: "owner",
      });
    }
  })();

  const httpServer = createServer(app);
  return httpServer;
}
