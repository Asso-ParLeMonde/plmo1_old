import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";

import Admin from "./Admin";
import User from "./User";
import { AppLanguageServiceProvider } from "./services/AppLanguageService";
import { LanguagesServiceProvider } from "./services/LanguagesService";
import { UserServiceProvider } from "./services/UserService";

import theme from "./util/theme";

function App() {
  return (
    <AppLanguageServiceProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <UserServiceProvider>
            <LanguagesServiceProvider>
              <Switch>
                <Route path="/admin" component={Admin} />
                <Route path="/" component={User} />
              </Switch>
            </LanguagesServiceProvider>
          </UserServiceProvider>
        </BrowserRouter>
      </ThemeProvider>
    </AppLanguageServiceProvider>
  );
}

export default App;
