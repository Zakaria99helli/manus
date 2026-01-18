import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Admin from "@/pages/Admin";
// استيراد الصفحات الجديدة التي كانت ناقصة
import MenuAdmin from "@/pages/MenuAdmin"; 
import InventoryAdmin from "@/pages/InventoryAdmin";
import { CartProvider } from "@/store/cart";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/admin" component={Admin} />
      {/* إضافة المسارات الجديدة هنا لكي يتعرف عليها المتصفح */}
      <Route path="/MenuAdmin" component={MenuAdmin} />
      <Route path="/InventoryAdmin" component={InventoryAdmin} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <Router />
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
