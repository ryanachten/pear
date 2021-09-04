import { Grommet, grommet } from "grommet";
import { Route, BrowserRouter, Switch } from "react-router-dom";

import { LandingPage } from "./Pages/LandingPage";
import { CallPage } from "./Pages/CallPage";

function App() {
  return (
    <Grommet theme={grommet}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/call">
            <CallPage />
          </Route>
        </Switch>
      </BrowserRouter>
    </Grommet>
  );
}

export default App;
