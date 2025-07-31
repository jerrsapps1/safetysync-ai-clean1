// File: src/App.tsx

import { Route, Switch } from "wouter";
import LandingPage from "./pages/landing-page.jsx";
import WorkspaceLayout from "./layouts/WorkspaceLayout";

export default function App() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/workspace" component={WorkspaceLayout} />
    </Switch>
  );
}