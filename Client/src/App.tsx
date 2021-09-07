import { Grommet, grommet } from "grommet";
import { useSelector } from "react-redux";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { CallPage } from "./pages/CallPage";
import { serviceSignalInstance, SignalContext } from "./services/SignalService";
import { LoadingPage } from "./pages/LoadingPage";
import { isServiceLoading } from "./selectors/peerSelectors";

function App() {
  const loading = useSelector(isServiceLoading);

  return (
    <Grommet theme={grommet}>
      <BrowserRouter>
        <SignalContext.Provider value={serviceSignalInstance}>
          {loading ? (
            <LoadingPage />
          ) : (
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route exact path="/call">
                <CallPage />
              </Route>
            </Switch>
          )}
        </SignalContext.Provider>
      </BrowserRouter>
    </Grommet>
  );
}

export default App;
