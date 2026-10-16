import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0f766e' },
    secondary: { main: '#f59e0b' },
    background: { default: '#f5f7f8' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

export default theme;
