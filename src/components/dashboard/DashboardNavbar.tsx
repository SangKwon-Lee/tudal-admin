import type { FC } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Hidden,
  IconButton,
  Toolbar,
} from '@material-ui/core';
import { experimentalStyled } from '@material-ui/core/styles';
import type { AppBarProps } from '@material-ui/core';
import MenuIcon from '../../icons/Menu';
import AccountPopover from './AccountPopover';
import { WhiteLogo } from '../common/Logo';

interface DashboardNavbarProps extends AppBarProps {
  onSidebarMobileOpen?: () => void;
}

const DashboardNavbarRoot = experimentalStyled(AppBar)(
  ({ theme }) => ({
    ...(theme.palette.mode === 'light' && {
      backgroundColor: theme.palette.primary.main,
      boxShadow: 'none',
      color: theme.palette.primary.contrastText,
    }),
    ...(theme.palette.mode === 'dark' && {
      backgroundColor: theme.palette.background.paper,
      borderBottom: `1px solid ${theme.palette.divider}`,
      boxShadow: 'none',
    }),
    zIndex: theme.zIndex.drawer + 100,
  }),
);

const DashboardNavbar: FC<DashboardNavbarProps> = (props) => {
  const { onSidebarMobileOpen, ...other } = props;

  return (
    <DashboardNavbarRoot {...other}>
      <Toolbar sx={{ minHeight: 64 }}>
        <Hidden lgUp>
          <IconButton color="inherit" onClick={onSidebarMobileOpen}>
            <MenuIcon fontSize="small" />
          </IconButton>
        </Hidden>
        <Hidden lgDown>
          <RouterLink to="/">
            <WhiteLogo
              sx={{
                height: 40,
                width: 40,
              }}
            />
          </RouterLink>
        </Hidden>
        <Box
          sx={{
            flexGrow: 1,
            ml: 2,
          }}
        />
        <Box sx={{ ml: 2 }}>
          <AccountPopover />
        </Box>
      </Toolbar>
    </DashboardNavbarRoot>
  );
};

DashboardNavbar.propTypes = {
  onSidebarMobileOpen: PropTypes.func,
};

export default DashboardNavbar;
