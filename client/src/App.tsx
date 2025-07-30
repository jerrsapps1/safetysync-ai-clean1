import { Route } from "wouter";
import LandingPage from "./LandingPage";
import EHSPage from "./pages/ehs";
import HRPage from "./pages/hr";
import InstructorsPage from "./pages/instructors";
import CentersPage from "./pages/centers";
import PricingPage from "./pages/pricing";
import ContactPage from "./pages/contact-simple";
import FAQPage from "./pages/faq";
import SupportPage from "./pages/support";

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
      <Route path="/faq" component={FAQPage} />
      <Route path="/support" component={SupportPage} />
    </>
  );
}

export default App;