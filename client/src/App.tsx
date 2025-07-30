import { Route } from "wouter";
import LandingPage from "./LandingPage";
import EHSPage from "./pages/ehs";
import HRPage from "./pages/hr";
import InstructorsPage from "./pages/instructors";
import CentersPage from "./pages/centers";

function App() {
  return (
    <>
      <Route path="/" component={LandingPage} />
      <Route path="/ehs" component={EHSPage} />
      <Route path="/hr" component={HRPage} />
      <Route path="/instructors" component={InstructorsPage} />
      <Route path="/centers" component={CentersPage} />
    </>
  );
}

export default App;