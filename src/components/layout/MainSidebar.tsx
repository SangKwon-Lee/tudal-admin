import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Chip,
  Drawer,
  // Hidden,
  Link,
} from '@material-ui/core';
import Logo from './../common/Logo';

interface MainSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const MainSidebar: FC<MainSidebarProps> = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname, onMobileClose, openMobile]);

  return (
    <Box display={{ lg: 'up' }}>
      <Drawer
        anchor="left"
        onClose={onMobileClose}
        open={openMobile}
        variant="temporary"
        PaperProps={{
          sx: {
            backgroundColor: 'background.default',
            width: 256,
          },
        }}
      >
        <Box
          sx={{
            alignItems: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 2,
          }}
        >
          <RouterLink to="/">
            <Logo />
          </RouterLink>
          <Box
            sx={{
              display: 'flex',
              pb: 2,
              pt: 3,
            }}
          >
            <Link
              color="textSecondary"
              component={RouterLink}
              to="/browse"
              underline="none"
              variant="body1"
            >
              Browse Components
            </Link>
            <Chip
              color="primary"
              label="NEW"
              size="small"
              sx={{
                maxHeight: 20,
                ml: 1,
                mr: 2,
              }}
            />
          </Box>
          <Link
            color="textSecondary"
            component={RouterLink}
            to="/docs"
            underline="none"
            variant="body1"
          >
            Documentation
          </Link>
          <Button
            color="primary"
            component="a"
            href="https://material-ui.com/store/items/devias-kit-pro"
            size="small"
            sx={{ mt: 4 }}
            target="_blank"
            variant="contained"
          >
            Get the kit
          </Button>
        </Box>
      </Drawer>
    </Box>
  );
};

MainSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default MainSidebar;
