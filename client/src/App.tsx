import { Route } from "wouter";
import LandingPage from "./LandingPage";
import EHSPage from "./pages/ehs";

function App() {
  return (
    <>
      <Route path="/" component={LandingPage} />
      <Route path="/ehs" component={EHSPage} />
    </>
  );
}

export default App;