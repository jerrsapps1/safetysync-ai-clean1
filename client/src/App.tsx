// File: src/App.tsx
import { Route, Switch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// @ts-ignore
import WorkspaceLayout from "./layouts/WorkspaceLayout";
// @ts-ignore
import LandingPage from "./pages/landing-replit-ready";

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Switch>
        <Route path="/" component={LandingPage} />
        <Route path="/workspace" component={WorkspaceLayout} />
        <Route path="/workspace/:rest*" component={WorkspaceLayout} />
      </Switch>
    </QueryClientProvider>
  );
}