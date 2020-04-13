import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";

import User from "./User";
import { AppLanguageServiceProvider } from "./services/AppLanguageService";
import { LanguagesServiceProvider } from "./services/LanguagesService";
import { UserServiceProvider } from "./services/UserService";

import theme from "./util/theme";

const Admin = lazy(() => {
  return import("./Admin");
});

const LoadingComponent = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress style={{ width: "300px", height: "300px" }} />
    </div>
  );
};

function App() {
  return (
    <AppLanguageServiceProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <UserServiceProvider>
            <LanguagesServiceProvider>
              <Suspense fallback={<LoadingComponent />}>
                <Switch>
                  <Route path="/admin">
                    <Admin />
                  </Route>
                  <Route path="/" component={User} />
                </Switch>
              </Suspense>
            </LanguagesServiceProvider>
          </UserServiceProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AppLanguageServiceProvider>
  );
}

export default App;
