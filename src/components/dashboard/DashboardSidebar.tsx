import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Divider, Drawer } from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ChartPieIcon from '../../icons/ChartPie';
import BriefcaseIcon from '../../icons/Briefcase';
import ChartSquareBarIcon from '../../icons/ChartSquareBar';
import CalendarIcon from '../../icons/Calendar';
import ShoppingBag from '../../icons/ShoppingBag';
import StarIcon from '../../icons/Star';
import DeviceTabletIcon from '../../icons/DeviceTablet';
import Logo from '../common/Logo';
import NavSection from '../layout/NavSection';
import Scrollbar from '../layout/Scrollbar';
import PencilIcon from '../../icons/PencilAlt';
import CashIcon from 'src/icons/Cash';
import useAuth from 'src/hooks/useAuth';
import CommentIcon from 'src/icons/DocumentText';
import UsersIcon from 'src/icons/Users';
import UserAddIcon from 'src/icons/UserAdd';
import ClipboardListList from 'src/icons/ClipboardList';
import LockIcon from 'src/icons/Lock';
import PlusIcon from 'src/icons/Plus';
import SortDescendingIcon from 'src/icons/SortDescending';
import HomeIcon from 'src/icons/Home';
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
      {
        title: '히든리포트 이미지',
        path: '/dashboard/hiddenreports/images',
        icon: <ChartSquareBarIcon fontSize="small" />,
      },
      {
        title: '히든리포트',
        path: '/dashboard/hiddenreports',
        icon: <ChartSquareBarIcon fontSize="small" />,
      },
    ],
  },
  {
    title: 'Admin',
    items: [
      {
        title: 'CP 관리',
        path: '/dashboard',
        icon: <UsersIcon fontSize="small" />,
        children: [
          {
            title: 'CP 리스트',
            path: '/dashboard/cp',
            icon: <UsersIcon fontSize="small" />,
          },
          {
            title: '달인 생성',
            path: '/dashboard/cp/createMaster',
            icon: <UserAddIcon fontSize="small" />,
          },
          {
            title: '히든 리포터 생성',
            path: '/dashboard/cp/createReporter',
            icon: <UserAddIcon fontSize="small" />,
          },
        ],
      },
    ],
  },
  {
    title: 'Contents',
    items: [
      {
        title: '히든박스',
        path: '/dashboard/hiddenboxes',
        icon: <StarIcon fontSize="small" />,
      },
      {
        title: '달인',
        path: '/dashboard/master',
        icon: <PencilIcon fontSize="small" />,
        children: [
          {
            title: '프로필',
            path: '/dashboard/master/profile',
            icon: <HomeIcon fontSize="small" />,
          },
          {
            title: '리스트',
            path: '/dashboard/master',
            icon: <ClipboardListList fontSize="small" />,
          },
          {
            title: '생성',
            path: '/dashboard/master/new',
            icon: <PlusIcon fontSize="small" />,
          },
          {
            title: '방 관리',
            path: '/dashboard/master/room',
            icon: <LockIcon fontSize="small" />,
          },
          {
            title: '구독현황',
            path: '/dashboard/master/subscribe',
            icon: <SortDescendingIcon fontSize="small" />,
          },
        ],
      },
      {
        title: '그룹 코멘트',
        path: '/dashboard/groups',
        icon: <CommentIcon fontSize="small" />,
      },
    ],
  },
  {
    title: 'Accounting',
    items: [
      {
        title: '골드',
        path: '/dashboard/gold',
        icon: <CashIcon fontSize="small" />,
        children: [
          {
            title: '리스트',
            path: '/dashboard/gold',
          },
          {
            title: '상세보기',
            path: '/dashboard/gold/detail',
          },
        ],
      },
      {
        title: '쿠폰',
        path: '/dashboard/coupons',
        icon: <PencilIcon fontSize="small" />,
      },
      {
        title: '팝업',
        path: '/dashboard/popup',
        icon: <PencilIcon fontSize="small" />,
        children: [
          {
            title: '리스트',
            path: '/dashboard/popup',
          },
          {
            title: '생성',
            path: '/dashboard/popup/new',
          },
        ],
      },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: '일정',
        path: '/dashboard/schedules',
        icon: <CalendarIcon fontSize="small" />,
      },
      {
        title: '종목',
        path: '/dashboard/stocks',
        icon: <ShoppingBag fontSize="small" />,
      },
      {
        title: '뉴스',
        path: '/dashboard/news-comments',
        icon: <DeviceTabletIcon fontSize="small" />,
      },
      {
        title: '키워드',
        path: '/dashboard/keywords',
        icon: <StarIcon fontSize="small" />,
      },
      {
        title: '카테고리',
        path: '/dashboard/categories',
        icon: <BriefcaseIcon fontSize="small" />,
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
  const [filterSection, setFilterSection] = useState([]);
  const { user } = useAuth();
  const location = useLocation();
  const lgUp = useMediaQuery((theme: Theme) =>
    theme.breakpoints.up('lg'),
  );

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    handleFilterSection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleFilterSection = () => {
    if (user.type === 'admin') {
      setFilterSection(sections);
    }
    if (user.type === 'cp') {
      const section = sections.filter((data) => {
        return data.title === 'Contents' || data.title === 'General';
      });
      setFilterSection(section);
    }
    if (user.type === 'cms') {
      const section = sections.filter(
        (data) =>
          data.title === 'Management' ||
          data.title === 'General' ||
          data.title === 'Generator',
      );
      setFilterSection(section);
    }
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        <Box
          sx={{
            display: {
              lg: 'none',
              xs: 'flex',
            },
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
        <Divider />
        <Box sx={{ p: 2 }}>
          {filterSection &&
            filterSection.map((section) => (
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
      </Scrollbar>
    </Box>
  );

  if (lgUp) {
    return (
      <Drawer
        anchor="left"
        open
        PaperProps={{
          sx: {
            backgroundColor: 'background.paper',
            height: 'calc(100% - 64px) !important',
            top: '64px !Important',
            width: 280,
          },
        }}
        variant="permanent"
      >
        {content}
      </Drawer>
    );
  }

  return (
    <Drawer
      anchor="left"
      onClose={onMobileClose}
      open={openMobile}
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          width: 280,
        },
      }}
      variant="temporary"
    >
      {content}
    </Drawer>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool,
};

export default DashboardSidebar;
