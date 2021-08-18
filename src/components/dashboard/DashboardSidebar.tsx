import { useEffect } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer, Hidden } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import ChartPieIcon from '../../icons/ChartPie';
import ChartSquareBarIcon from '../../icons/ChartSquareBar';
import FolderOpenIcon from '../../icons/FolderOpen';
import CalendarIcon from '../../icons/Calendar';
import DeviceTabletIcon from '../../icons/DeviceTablet';
import Logo from '../common/Logo';
import NavSection from '../layout/NavSection';
import Scrollbar from '../layout/Scrollbar';

interface DashboardSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const sections = [
  {
    title: 'General',
    items: [
      {
        title: 'Overview',
        path: '/dashboard',
        icon: <ChartSquareBarIcon fontSize="small" />,
      },
      // {
      //   title: 'Analytics',
      //   path: '/dashboard/analytics',
      //   icon: <ChartPieIcon fontSize="small" />
      // },
      // {
      //   title: 'Finance',
      //   path: '/dashboard/finance',
      //   icon: <ShoppingBagIcon fontSize="small" />
      // },
      // {
      //   title: 'Account',
      //   path: '/dashboard/account',
      //   icon: <UserIcon fontSize="small" />
      // }
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: '히든박스',
        path: '/dashboard/hiddenboxes',
        icon: <FolderOpenIcon fontSize="small" />,
      },
      {
        title: '일정',
        path: '/dashboard/schedule',
        icon: <CalendarIcon fontSize="small" />,
      },
      {
        title: '뉴스',
        path: '/dashboard/news-comments',
        icon: <DeviceTabletIcon fontSize="small" />,
      },
    ],
  },
  {
    title: 'Generator',
    items: [
      {
        title: '리포트',
        path: '/dashboard/report',
        icon: <ChartPieIcon fontSize="small" />,
      },
    ],
  },
];

const DashboardSidebar: FC<DashboardSidebarProps> = (props) => {
  const { onMobileClose, openMobile } = props;
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Hidden lgUp>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              p: 2,
            }}
          >
            <RouterLink to="/">
              <Logo
                sx={{
                  height: 40,
                  width: 40,
                }}
              />
            </RouterLink>
          </Box>
        </Hidden>
        <Divider />
        <Box sx={{ p: 2 }}>
          {sections.map((section) => (
            <NavSection
              key={section.title}
              pathname={location.pathname}
              sx={{
                '& + &': {
                  mt: 3,
                },
              }}
              {...section}
            />
          ))}
        </Box>
        <Divider />
      </Scrollbar>
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          onClose={onMobileClose}
          open={openMobile}
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              width: 220,
            },
          }}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor="left"
          open
          PaperProps={{
            sx: {
              backgroundColor: 'background.paper',
              height: 'calc(100% - 64px) !important',
              top: '64px !Important',
              width: 220,
            },
          }}
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default DashboardSidebar;
