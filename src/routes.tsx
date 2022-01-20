import { Suspense, lazy } from 'react';
import type { PartialRouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import AuthGuard from './components/guards/AuthGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import GuestGuard from './components/guards/GuestGuard';
import LoadingScreen from './components/layout/LoadingScreen';
import MainLayout from './components/layout/MainLayout';
import HiddenReportStatPage from './pages/dashboard/hiddenreport/HiddenReportStats.Page';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// Authentication pages

const Login = Loadable(
  lazy(() => import('./pages/authentication/Login')),
);
const PasswordRecovery = Loadable(
  lazy(() => import('./pages/authentication/PasswordRecovery')),
);
const PasswordReset = Loadable(
  lazy(() => import('./pages/authentication/PasswordReset')),
);
const Register = Loadable(
  lazy(() => import('./pages/authentication/Register')),
);
const VerifyCode = Loadable(
  lazy(() => import('./pages/authentication/VerifyCode')),
);

// Dashboard pages

//* Hiddenbox
const HiddenboxList = Loadable(
  lazy(() => import('./pages/dashboard/hiddenbox/HiddenboxList')),
);
const HiddenboxDetails = Loadable(
  lazy(() => import('./pages/dashboard/hiddenbox/HiddenboxDetails')),
);
const HiddenboxCreate = Loadable(
  lazy(() => import('./pages/dashboard/hiddenbox/HiddenboxCreate')),
);
const HiddenboxEdit = Loadable(
  lazy(() => import('./pages/dashboard/hiddenbox/HiddenboxEdit')),
);

//* Overview
const Overview = Loadable(
  lazy(() => import('./pages/dashboard/overview/Overview.Page')),
);

//* 리포트
const ReportMaker = Loadable(
  lazy(() => import('./pages/dashboard/report/ReportMaker')),
);

//* Schedule
const ScheduleList = Loadable(
  lazy(() => import('./pages/dashboard/schedule/Schedule.Page')),
);

//* Stock
const StockList = Loadable(
  lazy(() => import('./pages/dashboard/stock/Stock.Page')),
);
const StockTagList = Loadable(
  lazy(() => import('./pages/dashboard/stock/StockTag.Page')),
);

//* Keyword
const Keyword = Loadable(
  lazy(() => import('./pages/dashboard/keyword/Keyword.Page')),
);

//* category
const CategoryList = Loadable(
  lazy(() => import('./pages/dashboard/category/Category.Page')),
);

//* master
const MastersListPage = Loadable(
  lazy(() => import('./pages/dashboard/master/MastersList.Page')),
);
const MasterCreatePage = Loadable(
  lazy(() => import('./pages/dashboard/master/MasterCreate.Page')),
);
const MasterDetailsPage = Loadable(
  lazy(() => import('./pages/dashboard/master/MasterDetails.Page')),
);
const MasterEditPage = Loadable(
  lazy(() => import('./pages/dashboard/master/MasterEdit.Page')),
);
const MasterRoomPage = Loadable(
  lazy(() => import('./pages/dashboard/master/MasterRoom.Page')),
);
const MasterSubscribePage = Loadable(
  lazy(() => import('./pages/dashboard/master/MasterSubscribe.Page')),
);
const MasterProfilePage = Loadable(
  lazy(() => import('./pages/dashboard/master/MasterProfile.Page')),
);

//* gold
const GoldList = Loadable(
  lazy(() => import('./pages/dashboard/gold/GoldList.Page')),
);
const GoldDetail = Loadable(
  lazy(() => import('./pages/dashboard/gold/GoldDetail.Page')),
);

//* coupon
const CouponListPage = Loadable(
  lazy(() => import('./pages/dashboard/coupon/CouponList.Page')),
);
const CouponIssuedListPage = Loadable(
  lazy(
    () => import('./pages/dashboard/coupon/CouponIssuedList.Page'),
  ),
);

//* popup
const PopUpCreatePage = Loadable(
  lazy(() => import('./pages/dashboard/popup/PopUpCreate.Page')),
);
const PopUpEditPage = Loadable(
  lazy(() => import('./pages/dashboard/popup/PopUpEdit.Page')),
);
const PopUpListPage = Loadable(
  lazy(() => import('./pages/dashboard/popup/PopUpList.Page')),
);
const PopUpDetailPage = Loadable(
  lazy(() => import('./pages/dashboard/popup/PopUpDetail.Page')),
);

//* 배너
const BannerListPage = Loadable(
  lazy(() => import('./pages/dashboard/banner/BannerList.Page')),
);

//* 투달 그룹
const GroupCommentCreatePage = Loadable(
  lazy(
    () => import('./pages/dashboard/group/GroupCommentCreate.page'),
  ),
);
const GroupListPage = Loadable(
  lazy(() => import('./pages/dashboard/group/GroupList.Page')),
);

//* CP 관리
const CpCreatePage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CpCreate.Page')),
);
const CpMasterCreatePage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CpMasterCreate.Page')),
);
const CpReporterCreatePage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CpReporterCreate.Page')),
);
const CpListPage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CpList.Page')),
);
const CpMasterDetailPage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CpMasterDetail.Page')),
);
const CpReporterDetailPage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CpReporterDetail.Page')),
);
const CPQandAListPage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CPQandAList.Page')),
);
const CPQandACreatePage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CPQandACreate.Page')),
);
const CPQandAAnswerPage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CPQandAAnswer.Page')),
);
const CPQandADetailPage = Loadable(
  lazy(() => import('./pages/dashboard/cp/CPQandADetail.Page')),
);

// Viewer pages
const HiddenboxViewer = Loadable(
  lazy(() => import('./pages/viewer/HiddenboxViewer')),
);
const TodayKeywordViewer = Loadable(
  lazy(() => import('./pages/viewer/TodayKeywordViewer')),
);
const MasterIntroViewer = Loadable(
  lazy(() => import('./pages/viewer/MasterViewer')),
);

const ReporterIntroViewer = Loadable(
  lazy(() => import('./pages/viewer/ReporterViewer')),
);
const NewsPage = Loadable(
  lazy(() => import('./pages/dashboard/news/News.Page')),
);

//* 히든 리포터

const HiddenReportProfilePage = Loadable(
  lazy(
    () =>
      import(
        './pages/dashboard/hiddenreport/HiddenReportProfile.Page'
      ),
  ),
);

const HiddenReportImageList = Loadable(
  lazy(
    () =>
      import(
        './pages/dashboard/hiddenreport/HiddenReportImageList.Page'
      ),
  ),
);
const HiddenReportImageCreate = Loadable(
  lazy(
    () =>
      import(
        './pages/dashboard/hiddenreport/HiddenReportImageCreate.Page'
      ),
  ),
);
const HiddenReportList = Loadable(
  lazy(
    () =>
      import('./pages/dashboard/hiddenreport/HiddenReportList.Page'),
  ),
);
const HiddenReportCreate = Loadable(
  lazy(
    () =>
      import(
        './pages/dashboard/hiddenreport/HiddenReportCreate.Page'
      ),
  ),
);
const HiddenReportDetailView = Loadable(
  lazy(
    () =>
      import(
        './pages/dashboard/hiddenreport/hiddenReportDeatilView.Page'
      ),
  ),
);
const HiddenReportViewer = Loadable(
  lazy(
    () =>
      import(
        './pages/dashboard/hiddenreport/HiddenReportViewer.Page'
      ),
  ),
);

// Error pages

const AuthorizationRequired = Loadable(
  lazy(() => import('./pages/AuthorizationRequired')),
);
const NotFound = Loadable(lazy(() => import('./pages/NotFound')));
const ServerError = Loadable(
  lazy(() => import('./pages/ServerError')),
);

const routes: PartialRouteObject[] = [
  {
    path: 'authentication',
    children: [
      {
        path: 'login',
        element: (
          <GuestGuard>
            <Login />
          </GuestGuard>
        ),
      },
      {
        path: 'login-unguarded',
        element: <Login />,
      },
      {
        path: 'password-recovery',
        element: <PasswordRecovery />,
      },
      {
        path: 'password-reset',
        element: <PasswordReset />,
      },
      {
        path: 'register',
        element: (
          <GuestGuard>
            <Register />
          </GuestGuard>
        ),
      },
      {
        path: 'register-unguarded',
        element: <Register />,
      },
      {
        path: 'verify-code',
        element: <VerifyCode />,
      },
    ],
  },
  {
    path: 'viewer',
    children: [
      {
        path: 'hiddenbox/:hiddenboxId',
        element: <HiddenboxViewer />,
      },
      {
        path: 'todaykeyword',
        element: <TodayKeywordViewer />,
      },
      {
        path: 'hiddenreport/:id',
        element: <HiddenReportViewer />,
      },
      {
        path: 'master/intro/:id',
        element: <MasterIntroViewer />,
      },
      {
        path: 'reporter/intro/:id',
        element: <ReporterIntroViewer />,
      },
    ],
  },
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout />
      </AuthGuard>
    ),
    children: [
      {
        path: '/',
        element: <Overview />,
      },
      {
        path: '/qas',
        element: <CPQandAListPage />,
      },
      {
        path: '/qas/new',
        element: <CPQandACreatePage />,
      },
      {
        path: '/qas/:qId/edit',
        element: <CPQandACreatePage />,
      },
      {
        path: '/qas/:qId/answer',
        element: <CPQandAAnswerPage />,
      },
      {
        path: '/qas/:qId/answer/:aId/edit',
        element: <CPQandAAnswerPage />,
      },
      {
        path: '/qas/:qId',
        element: <CPQandADetailPage />,
      },
      {
        path: 'hiddenreports',
        children: [
          {
            path: '/',
            element: <HiddenReportList />,
          },
          {
            path: '/:reportId',
            element: <HiddenReportDetailView />,
          },
          {
            path: 'images',
            element: <HiddenReportImageList />,
          },
          {
            path: 'images/new',
            element: <HiddenReportImageCreate />,
          },
          {
            path: 'images/:id/edit',
            element: <HiddenReportImageCreate mode={'edit'} />,
          },

          {
            path: 'new',
            element: <HiddenReportCreate />,
          },
          {
            path: '/:reportId/edit',
            element: <HiddenReportCreate />,
          },
          {
            path: '/profile',
            element: <HiddenReportProfilePage />,
          },
          {
            path: '/history',
            element: <HiddenReportStatPage />,
          },
          {
            path: '/viewer/:id',
            element: <HiddenReportViewer />,
          },
        ],
      },
      {
        path: 'hiddenboxes',
        children: [
          {
            path: '/',
            element: <HiddenboxList />,
          },
          {
            path: ':hiddenboxId',
            element: <HiddenboxDetails />,
          },
          {
            path: ':hiddenboxId/edit',
            element: <HiddenboxEdit />,
          },
          {
            path: 'new',
            element: <HiddenboxCreate />,
          },
        ],
      },
      {
        path: 'schedules',
        children: [
          {
            path: '/',
            element: <ScheduleList />,
          },
        ],
      },
      {
        path: 'news-comments',
        children: [
          {
            path: '/',
            element: <NewsPage />,
          },
        ],
      },
      {
        path: 'stocks',
        children: [
          {
            path: '/',
            element: <StockList />,
          },
        ],
      },
      {
        path: 'stock-tag',
        children: [
          {
            path: '/',
            element: <StockTagList />,
          },
        ],
      },
      {
        path: 'keywords',
        children: [
          {
            path: '/',
            element: <Keyword />,
          },
        ],
      },
      {
        path: 'categories',
        children: [
          {
            path: '/',
            element: <CategoryList />,
          },
        ],
      },
      {
        path: 'report',
        children: [
          {
            path: '/',
            element: <ReportMaker />,
          },
        ],
      },
      {
        path: 'gold',
        children: [
          {
            path: '/',
            element: <GoldList />,
          },
          {
            path: '/detail/:userId',
            element: <GoldDetail />,
          },
          {
            path: '/detail',
            element: <GoldDetail />,
          },
        ],
      },
      {
        path: 'master',
        children: [
          {
            path: '/',
            element: <MastersListPage />,
          },
          {
            path: '/new',
            element: <MasterCreatePage />,
          },
          {
            path: ':masterId',
            element: <MasterDetailsPage />,
          },
          {
            path: ':masterId/edit',
            element: <MasterEditPage />,
          },
          {
            path: 'room',
            element: <MasterRoomPage />,
          },
          {
            path: 'subscribe',
            element: <MasterSubscribePage />,
          },
          {
            path: '/profile',
            element: <MasterProfilePage />,
          },
        ],
      },
      {
        path: 'coupons',
        children: [
          {
            path: '/',
            element: <CouponListPage />,
          },
          {
            path: '/:couponId',
            element: <CouponIssuedListPage />,
          },
        ],
      },
      {
        path: 'popup',
        children: [
          {
            path: '/',
            element: <PopUpListPage />,
          },
          {
            path: '/new',
            element: <PopUpCreatePage />,
          },
          {
            path: ':popupId/edit',
            element: <PopUpEditPage />,
          },
          {
            path: ':popupId',
            element: <PopUpDetailPage />,
          },
        ],
      },
      {
        path: 'groups',
        children: [
          {
            path: '/',
            element: <GroupListPage />,
          },
          {
            path: '/comments/:groupCommentId',
            element: <GroupCommentCreatePage />,
          },
        ],
      },
      {
        path: 'cp',
        children: [
          {
            path: '/signup',
            element: <CpCreatePage />,
          },
          {
            path: '/master/signup/',
            element: <CpMasterCreatePage />,
          },
          {
            path: '/master/signup/:userId',
            element: <CpMasterCreatePage />,
          },
          {
            path: '/reporter/signup',
            element: <CpReporterCreatePage />,
          },
          {
            path: '/reporter/signup/:userId',
            element: <CpReporterCreatePage />,
          },
          {
            path: 'master/:masterId/edit',
            element: <CpMasterCreatePage />,
          },
          {
            path: ':reporterId/edit/reporter',
            element: <CpReporterCreatePage />,
          },
          {
            path: ':userId/master',
            element: <CpMasterDetailPage />,
          },
          {
            path: ':reporterId/reporter',
            element: <CpReporterDetailPage />,
          },
          {
            path: '/',
            element: <CpListPage />,
          },
        ],
      },
      {
        path: 'banner',
        children: [
          {
            path: '/',
            element: <BannerListPage />,
          },
        ],
      },
    ],
  },

  {
    path: '*',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '401',
        element: <AuthorizationRequired />,
      },
      {
        path: '404',
        element: <NotFound />,
      },
      {
        path: '500',
        element: <ServerError />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
];

export default routes;
