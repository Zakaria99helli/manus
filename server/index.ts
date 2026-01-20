import express, { type Request, Response, NextFunction } from "express";
import registerRoutes from "./routes"; // ⬅️ غيّرت من { registerRoutes } لـ registerRoutes
import { serveStatic } from "./static";
import { storage } from "./storage";
import session from "express-session";
import getPort from "get-port";


const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf ) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  app.use(
    session({
      secret: "damas-food-secret",
      resave: false,
      saveUninitialized: false,
      store: storage.sessionStore,
      cookie: {
        secure: process.env.NODE_ENV === "production",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    })
  );

  const httpServer = await registerRoutes(app );

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  // في الإنتاج فقط: قدم الملفات الثابتة
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    // في التطوير: استخدم Vite كـ middleware لكل الطلبات غير API
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app );
  }

 // الحل الصحيح: الالتزام بمتغير البيئة PORT الذي تفرضه منصة الرفع
  const port = Number(process.env.PORT) || 10000;
  
  app.listen(port, "0.0.0.0", () => {
    log(`Server running on port ${port}`);
  });
})();
