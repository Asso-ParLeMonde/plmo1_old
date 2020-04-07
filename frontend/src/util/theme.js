import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#6065fc",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
      contrastText: "#ffffff",
    },
    secondary: {
      // light: will be calculated from palette.secondary.main,
      main: "#79C3A5",
      // dark: will be calculated from palette.secondary.main,
      contrastText: "#ffffff",
    },
    // error: will use the default color
    background: {
      default: "#fff",
    },
  },
  typography: {
    fontFamily: ["Open Sans", "Arial", "sans-serif"].join(","),
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
      margin: 0,
    },
    h3: {
      fontSize: "1.1rem",
      fontFamily: "'Alegreya Sans', sans-serif",
      fontWeight: "normal",
      margin: 0,
    },
  },
});

export default theme;
