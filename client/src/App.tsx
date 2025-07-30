import { Router, Route } from "wouter";
import LandingPage from "./pages/landing";
import SimpleTest from "./pages/simple-test";
import UltraSimple from "./pages/ultra-simple";
import EHSPage from "./pages/ehs";
import HRPage from "./pages/hr";
import InstructorsPage from "./pages/instructors";
import CentersPage from "./pages/centers";
import PricingPage from "./pages/pricing";
import ContactPage from "./pages/contact-simple";
import FAQPage from "./pages/faq";
import SupportPage from "./pages/support";
// @ts-ignore
import AdminSupportDashboard from "./pages/admin/support.jsx";

function App() {
  return (
    <Router>
      <Route path="/" component={LandingPage} />
      <Route path="/simple" component={UltraSimple} />
      <Route path="/test" component={SimpleTest} />
      <Route path="/ehs" component={EHSPage} />
      <Route path="/hr" component={HRPage} />
      <Route path="/instructors" component={InstructorsPage} />
      <Route path="/centers" component={CentersPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/contact" component={ContactPage} />
      <Route path="/faq" component={FAQPage} />
      <Route path="/support" component={SupportPage} />
      <Route path="/admin/support" component={AdminSupportDashboard} />
    </Router>
  );
}

export default App;