import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link as RouterLink, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const navButtonSx = {
  minWidth: 0,
  px: { xs: 1, sm: 2 },
  '&.active': { bgcolor: 'rgba(255, 255, 255, 0.18)' },
};

export default function AppLayout() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ gap: { xs: 0.5, sm: 1 }, px: { xs: 1, sm: 3 } }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ fontWeight: 700, color: 'inherit', textDecoration: 'none', mr: { xs: 0.5, sm: 2 } }}
          >
            Retain
          </Typography>
          <Button color="inherit" component={NavLink} to="/" end sx={navButtonSx}>
            Dashboard
          </Button>
          <Button color="inherit" component={NavLink} to="/expenses" sx={navButtonSx}>
            Expenses
          </Button>
          {isAdmin && (
            <Button color="inherit" component={NavLink} to="/admin" sx={navButtonSx}>
              Admin
            </Button>
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Typography sx={{ display: { xs: 'none', md: 'block' }, mr: 1 }}>{user?.name}</Typography>
          <Button color="inherit" onClick={logout} sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
            Sign out
          </Button>
          <IconButton
            color="inherit"
            aria-label="Sign out"
            onClick={logout}
            sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
          >
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 4 } }}>
        <Outlet />
      </Container>
    </Box>
  );
}
