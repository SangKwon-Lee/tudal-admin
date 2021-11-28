import { useEffect, useState } from 'react';
import type { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer } from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import ChartPieIcon from '../../icons/ChartPie';
import ChartSquareBarIcon from '../../icons/ChartSquareBar';
import CalendarIcon from '../../icons/Calendar';
import StarIcon from '../../icons/Star';
import DeviceTabletIcon from '../../icons/DeviceTablet';
import NavSection from '../layout/NavSection';
import Scrollbar from '../layout/Scrollbar';
import PencilIcon from '../../icons/PencilAlt';
import CashIcon from 'src/icons/Cash';
import useAuth from 'src/hooks/useAuth';
import UsersIcon from 'src/icons/Users';
import ChatAltIcon from 'src/icons/ChatAlt';
import HomeIcon from 'src/icons/Home';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import SpellcheckIcon from '@material-ui/icons/Spellcheck';
import CategoryIcon from '@material-ui/icons/Category';
import PaletteIcon from '@material-ui/icons/Palette';

interface DashboardSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const sections = [
  {
    title: 'Home',
    items: [
      {
        title: '홈',
        path: '/dashboard',
        icon: <HomeIcon fontSize="small" />,
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
          },
          {
            title: '달인 생성',
            path: '/dashboard/cp/createMaster',
          },
          {
            title: '히든 리포터 생성',
            path: '/dashboard/cp/createReporter',
          },
        ],
      },
    ],
  },
  {
    title: 'Accounting',
    items: [
      {
        title: '골드',
        path: '/dashboard/gold',
        icon: <AttachMoneyIcon fontSize="small" />,
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
        icon: <CashIcon fontSize="small" />,
      },
      // {
      //   title: '팝업',
      //   path: '/dashboard/popup',
      //   icon: <PencilIcon fontSize="small" />,
      //   children: [
      //     {
      //       title: '리스트',
      //       path: '/dashboard/popup',
      //     },
      //     {
      //       title: '생성',
      //       path: '/dashboard/popup/new',
      //     },
      //   ],
      // },
    ],
  },
  {
    title: 'Management',
    items: [
      {
        title: '히든 리포트 관리',
        path: '/dashboard',
        icon: <PaletteIcon fontSize="small" />,
        children: [
          {
            title: '히든 리포트 배너 관리',
            path: '/dashboard/banner',
          },
          {
            title: '히든리포트 이미지 관리',
            path: '/dashboard/hiddenreports/images',
          },
        ],
      },
    ],
  },
  {
    title: 'Hiddenbox',
    items: [
      {
        title: '히든박스',
        path: '/dashboard/hiddenboxes',
        icon: <StarIcon fontSize="small" />,
      },
    ],
  },
  {
    title: 'Hidden-Reporter',
    items: [
      {
        title: '히든리포트',
        path: '/dashboard/hiddenreports',
        icon: <StarIcon fontSize="small" />,
        children: [
          {
            title: '프로필',
            path: '/dashboard/hiddenreports/profile',
          },
          {
            title: '리스트',
            path: '/dashboard/hiddenreports',
          },
          {
            title: '정산/통계',
            path: '/dashboard/hiddenreports/stats',
          },
        ],
      },
    ],
  },
  {
    title: 'Master',
    items: [
      {
        title: '달인',
        path: '/dashboard/master',
        icon: <PencilIcon fontSize="small" />,
        children: [
          {
            title: '프로필',
            path: '/dashboard/master/profile',
          },
          {
            title: '리스트',
            path: '/dashboard/master',
          },
          {
            title: '생성',
            path: '/dashboard/master/new',
          },
          {
            title: '방 관리',
            path: '/dashboard/master/room',
          },
          // {
          //   title: '구독현황',
          //   path: '/dashboard/master/subscribe',
          // },
        ],
      },
    ],
  },

  {
    title: 'CMS',
    items: [
      {
        title: '일정',
        path: '/dashboard/schedules',
        icon: <CalendarIcon fontSize="small" />,
      },
      {
        title: '종목',
        path: '/dashboard/stocks',
        icon: <ChartSquareBarIcon fontSize="small" />,
      },
      {
        title: '뉴스',
        path: '/dashboard/news-comments',
        icon: <DeviceTabletIcon fontSize="small" />,
      },
      {
        title: '키워드',
        path: '/dashboard/keywords',
        icon: <SpellcheckIcon fontSize="small" />,
      },
      {
        title: '카테고리',
        path: '/dashboard/categories',
        icon: <CategoryIcon fontSize="small" />,
      },
      {
        title: '그룹 코멘트',
        path: '/dashboard/groups',
        icon: <ChatAltIcon fontSize="small" />,
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
    if (user.type === 'cp' && !user.master && !user.hidden_reporter) {
      const section = sections.filter((data) => {
        return data.title === 'Home';
      });
      setFilterSection(section);
    }
    if (user.type === 'cp' && user.master) {
      const section = sections.filter((data) => {
        return data.title === 'Master' || data.title === 'Home';
      });
      setFilterSection(section);
    }
    if (user.type === 'cp' && user.hidden_reporter) {
      const section = sections.filter((data) => {
        return (
          data.title === 'Hidden-Reporter' || data.title === 'Home'
        );
      });
      setFilterSection(section);
    }
    if (user.type === 'cp' && user.hidden_reporter && user.master) {
      const section = sections.filter((data) => {
        return (
          data.title === 'Hidden-Reporter' ||
          data.title === 'Home' ||
          data.title === 'Master'
        );
      });
      setFilterSection(section);
    }
    if (user.type === 'cms') {
      const section = sections.filter(
        (data) => data.title === 'Home' || data.title === 'CMS',
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
        backgroundColor: '#101827',
      }}
    >
      <Scrollbar options={{ suppressScrollX: true }}>
        {/* <Box
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
        </Box> */}
        <Box sx={{ p: 2, backgroundColor: '#101827' }}>
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
            // height: 'calc(100% - 64px) !important',
            // top: '64px !Important',
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
