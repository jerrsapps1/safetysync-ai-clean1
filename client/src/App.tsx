import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Router, Route } from "wouter";

// Import pages
import Basic from "./pages/basic";
import SupportPage from "./pages/support";
import PlatformTest from "./pages/platform-test";
import AdminLogin from "./pages/admin-login";
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
      <Router>
        <Route path="/" component={Basic} />
        <Route path="/support" component={SupportPage} />
        <Route path="/test" component={PlatformTest} />
        <Route path="/admin-login" component={AdminLogin} />
        <Route path="/admin/support" component={AdminSupportDashboard} />
      </Router>
    </QueryClientProvider>
  );
}

export default App;