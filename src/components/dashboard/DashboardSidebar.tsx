import { useEffect, useState } from 'react';
import type { FC } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Box, Drawer } from '@material-ui/core';
import type { Theme } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
// import ChartPieIcon from '../../icons/ChartPie';
import ChartSquareBarIcon from '../../icons/ChartSquareBar';
import CalendarIcon from '../../icons/Calendar';
// import StarIcon from '../../icons/Star';
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
import Moon from 'src/icons/Moon';
import { Dock } from '@material-ui/icons';

interface DashboardSidebarProps {
  onMobileClose: () => void;
  openMobile: boolean;
}

const sections = [
  {
    title: 'Home',
    items: [
      {
        title: '대시보드',
        path: '/dashboard',
        icon: <HomeIcon fontSize="small" />,
      },
      {
        title: '투달러스 대시보드',
        path: '/dashboard/tudalus',
        icon: <Moon fontSize="small" />,
      },
      {
        title: '문의사항',
        path: '/dashboard/qas',
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
            path: '/dashboard/cp/master/signup',
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
        title: '히든 리포트 관리',
        path: '/dashboard',
        icon: <PaletteIcon fontSize="small" />,
        children: [
          {
            title: '히든 리포트 배너 관리',
            path: '/dashboard/banner',
          },
          {
            title: '히든 리포트 이미지 관리',
            path: '/dashboard/hiddenreports/images',
          },
        ],
      },
      {
        title: '사이드 배너',
        path: '/dashboard/sidebanner/list',
        icon: <PaletteIcon fontSize="small" />,
      },
    ],
  },
  // {
  //   title: 'Hiddenbox',
  //   items: [
  //     {
  //       title: '히든박스',
  //       path: '/dashboard/hiddenboxes',
  //       icon: <StarIcon fontSize="small" />,
  //     },
  //   ],
  // },
  {
    title: 'Contents',
    items: [
      // {
      //   title: '히든리포트',
      //   path: '/dashboard/hiddenreports',
      //   icon: <StarIcon fontSize="small" />,
      //   children: [
      //     {
      //       title: '프로필',
      //       path: '/dashboard/hiddenreports/profile',
      //     },
      //     {
      //       title: '리스트',
      //       path: '/dashboard/hiddenreports',
      //     },
      //     {
      //       title: '판매내역',
      //       path: '/dashboard/hiddenreports/history',
      //     },
      //   ],
      // },
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
            title: '피드 리스트',
            path: '/dashboard/master',
          },
          {
            title: '피드 방 관리',
            path: '/dashboard/master/room',
          },
          {
            title: '히든리포트 리스트',
            path: '/dashboard/hiddenreports',
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
        icon: <ChartSquareBarIcon fontSize="small" />,
        children: [
          {
            title: '종목',
            path: '/dashboard/stocks',
          },
          {
            title: '종목 태그',
            path: '/dashboard/stock-tag',
          },
          {
            title: '종목 코멘트',
            path: '/dashboard/stock-comment',
          },
        ],
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
        title: '데일리 리스트',
        path: '/dashboard/groups',
        icon: <ChatAltIcon fontSize="small" />,
      },
      {
        title: '공지사항',
        path: '/dashboard/master/notice',
        icon: <PencilIcon fontSize="small" />,
      },
      {
        title: '유튜브',
        path: '/dashboard/youtube/list',
        icon: <Dock fontSize="small" />,
      },
    ],
  },
  {
    title: '투달유에스',
    items: [
      {
        title: '콘텐츠',
        path: '/dashboard/tudalus/contents/create',
        icon: <CalendarIcon fontSize="small" />,
        children: [
          {
            title: '리스트',
            path: '/dashboard/tudalus/contents/list',
          },
          {
            title: '생성',
            path: '/dashboard/tudalus/contents/create',
          },
        ],
      },
      {
        title: '테마 리스트',
        path: '/dashboard/tudalus/theme',
        icon: <CalendarIcon fontSize="small" />,
      },
    ],
  },
  {
    title: 'MZ',
    items: [
      {
        title: '키워드',
        path: '/dashboard/mzkeyword',
        icon: <PencilIcon fontSize="small" />,
      },
    ],
  },
  {
    title: '한경',
    items: [
      {
        title: '리스트',
        path: '/dashboard/hankyung/list',
        icon: <PencilIcon fontSize="small" />,
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
    theme.breakpoints.up('xs'),
  );

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    handleFilterSection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleFilterSection = () => {
    if (user.type === 'mz') {
      const section = sections.filter((data) => data.title === 'MZ');
      setFilterSection(section);
    }
    if (user.type === 'admin') {
      setFilterSection(sections);
    }

    if (user.type === 'cp') {
      const section = sections.filter((data) => {
        return data.title === 'Contents';
      });
      setFilterSection(section);
    }

    if (user.type === 'cms') {
      const section = sections.filter((data) => data.title === 'CMS');
      setFilterSection(section);
    }
  };
  const content = (
    <>
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
    </>
  );

  if (!lgUp) {
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
