import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route } from "wouter";

// Import layout and pages
// @ts-ignore
import MainLayout from "./layouts/MainLayout";
import LandingPage from "./pages/landing-replit-ready";
import Basic from "./pages/basic";
import SupportPage from "./pages/support";
import PlatformTest from "./pages/platform-test";
import AdminLogin from "./pages/admin-login";
import ClientPortal from "./pages/client-portal";
import Contact from "./pages/contact";
import Pricing from "./pages/pricing";
// @ts-ignore
import AdminSupportDashboard from "./pages/admin/support.jsx";

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainLayout>
        <Router>
          <Route path="/" component={LandingPage} />
          <Route path="/basic" component={Basic} />
          <Route path="/support" component={SupportPage} />
          <Route path="/test" component={PlatformTest} />
          <Route path="/admin-login" component={AdminLogin} />
          <Route path="/admin/support" component={AdminSupportDashboard} />
          <Route path="/client-portal" component={ClientPortal} />
          <Route path="/contact" component={Contact} />
          <Route path="/pricing" component={Pricing} />
        </Router>
      </MainLayout>
    </QueryClientProvider>
  );
}

export default App;