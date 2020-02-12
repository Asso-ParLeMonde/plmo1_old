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
      main: '#79C3A5',
      // dark: will be calculated from palette.secondary.main,
      contrastText: '#ffffff',
    },
    // error: will use the default color
    background: {
      default: "#fff",
    }
  },
  typography: {
    fontFamily: [
      "Open Sans",
      "Arial",
      "sans-serif",
    ].join(','),
    h1: {
      fontSize: "2rem",
      fontFamily: "'Alegreya Sans', sans-serif",
      fontWeight: "bold",
      margin: "1.2rem 0 1rem 0",
    },
    h2: {
      fontSize: "1.5rem",
      fontFamily: "'Alegreya Sans', sans-serif",
      fontWeight: "normal",
      margin : 0,
    },
    h3: {
      fontSize: "1.1rem",
      fontFamily: "'Alegreya Sans', sans-serif",
      fontWeight: "normal",
      margin : 0,
    }
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
