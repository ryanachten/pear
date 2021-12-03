import { Grommet } from "grommet";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Route, BrowserRouter, Switch, Redirect } from "react-router-dom";

import { LandingPage } from "./pages/LandingPage";
import { CallPage } from "./pages/CallPage";
import { serviceSignalInstance, SignalContext } from "./services/SignalService";
import { LoadingPage } from "./pages/LoadingPage";
import { isServiceLoading } from "./selectors/peerSelectors";
import theme from "./theme";

import "./App.css";

function App() {
  const [minLoadingPeriodExceeded, setMinLoadingPeriodExceeded] =
    useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMinLoadingPeriodExceeded(true);
    }, 4000);
  }, []);
  const loading = useSelector(isServiceLoading);

  return (
    <Grommet theme={theme}>
      <BrowserRouter>
        <SignalContext.Provider value={serviceSignalInstance}>
          {loading || !minLoadingPeriodExceeded ? (
            <LoadingPage />
          ) : (
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route exact path="/call/:groupCode">
                <CallPage />
              </Route>
              <Redirect to="/" />
            </Switch>
          )}
        </SignalContext.Provider>
      </BrowserRouter>
    </Grommet>
  );
}

export default App;
