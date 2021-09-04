import { Grommet, grommet } from "grommet";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { CallPage } from "./pages/CallPage";
import { serviceSignalInstance, SignalContext } from "./services/SignalService";
import { useEffect, useState } from "react";
import { SignalServiceEvent } from "./constants/interfaces";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    document.addEventListener(
      SignalServiceEvent.OnServiceReady,
      (e: CustomEventInit) => {
        setLoading(false);
      }
    );
  }, []);

  return (
    <Grommet theme={grommet}>
      <BrowserRouter>
        <SignalContext.Provider value={serviceSignalInstance}>
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
