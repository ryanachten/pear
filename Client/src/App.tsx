import { Grommet, grommet } from "grommet";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { CallPage } from "./pages/CallPage";
import { SignalContext, SignalService } from "./services/SignalService";
import { useEffect, useState } from "react";

function App() {
  const [loading, setLoading] = useState(true);
  const [signalService, setSignalService] =
    useState<SignalService | null>(null);

  useEffect(() => {
    const service = new SignalService({
      onCompleteSetup: () => {
        setLoading(false);
      },
    });
    setSignalService(service);
  }, []);

  return (
    <Grommet theme={grommet}>
      <BrowserRouter>
        <SignalContext.Provider value={signalService}>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route path="/call">
              <CallPage />
            </Route>
          </Switch>
        </SignalContext.Provider>
      </BrowserRouter>
    </Grommet>
  );
}

export default App;
