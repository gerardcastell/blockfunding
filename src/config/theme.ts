import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#ec5990',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      // light: '#013082',
      main: '#010C21',
      // dark: will be calculated from palette.secondary.main,
      // contrastText: 'fff1ff',
    },
    background: {
      default: '#010C21',
    },
  },
});
