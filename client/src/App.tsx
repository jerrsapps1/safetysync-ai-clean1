import { Route } from "wouter";
import LandingPage from "./LandingPage";
import EHSPage from "./pages/ehs";
import HRPage from "./pages/hr";
import InstructorsPage from "./pages/instructors";
import CentersPage from "./pages/centers";
import PricingPage from "./pages/pricing";
import ContactPage from "./pages/contact-simple";

function App() {
  return (
    <>
      <Route path="/" component={LandingPage} />
      <Route path="/ehs" component={EHSPage} />
      <Route path="/hr" component={HRPage} />
      <Route path="/instructors" component={InstructorsPage} />
      <Route path="/centers" component={CentersPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/contact" component={ContactPage} />
    </>
  );
}

export default App;