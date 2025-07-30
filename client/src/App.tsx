import { Route } from "wouter";
import LandingPage from "./LandingPage";
import EHSPage from "./pages/ehs";
import HRPage from "./pages/hr";

function App() {
  return (
    <>
      <Route path="/" component={LandingPage} />
      <Route path="/ehs" component={EHSPage} />
      <Route path="/hr" component={HRPage} />
    </>
  );
}

export default App;