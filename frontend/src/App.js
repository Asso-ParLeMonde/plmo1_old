import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import Admin from "./Admin";
import User from "./User";

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#6065fc',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: '#ffffff',
    },
    secondary: {
      // light: will be calculated from palette.secondary.main,
      main: '#79c3a5',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    },
    // error: will use the default color
  },
  typography: {
    fontFamily: [
      "Open Sans",
      "Arial",
      "sans-serif",
    ].join(','),
  },
});

function App() {
  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <CssBaseline />
          <BrowserRouter>
            <Switch>
              <Route path="/admin" component={Admin} />
              <Route path="/" component={User} />
            </Switch>
          </BrowserRouter>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default App;
