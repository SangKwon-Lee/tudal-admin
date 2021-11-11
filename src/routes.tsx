import { Suspense, lazy } from 'react';
import type { PartialRouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import AuthGuard from './components/guards/AuthGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import GuestGuard from './components/guards/GuestGuard';
import LoadingScreen from './components/layout/LoadingScreen';
import MainLayout from './components/layout/MainLayout';

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
const HiddenboxList = Loadable(
  lazy(() => import('./pages/dashboard/HiddenboxList')),
);
const HiddenboxDetails = Loadable(
  lazy(() => import('./pages/dashboard/HiddenboxDetails')),
);

const HiddenboxCreate = Loadable(
  lazy(() => import('./pages/dashboard/HiddenboxCreate')),
);
const HiddenboxEdit = Loadable(
  lazy(() => import('./pages/dashboard/HiddenboxEdit')),
);
const Overview = Loadable(
  lazy(() => import('./pages/dashboard/Overview.Page')),
);
const ReportMaker = Loadable(
  lazy(() => import('./pages/dashboard/ReportMaker')),
);
const ScheduleList = Loadable(
  lazy(() => import('./pages/dashboard/Schedule.Page')),
);
const StockList = Loadable(
  lazy(() => import('./pages/dashboard/Stock.Page')),
);

const Keyword = Loadable(
  lazy(() => import('./pages/dashboard/Keyword.Page')),
);
const CategoryList = Loadable(
  lazy(() => import('./pages/dashboard/Category.Page')),
);

const MastersListPage = Loadable(
  lazy(() => import('./pages/dashboard/MastersList.Page')),
);
const MasterCreatePage = Loadable(
  lazy(() => import('./pages/dashboard/MasterCreate.Page')),
);
const MasterDetailsPage = Loadable(
  lazy(() => import('./pages/dashboard/MasterDetails.Page')),
);
const MasterEditPage = Loadable(
  lazy(() => import('./pages/dashboard/MasterEdit.Page')),
);
const MasterRoomPage = Loadable(
  lazy(() => import('./pages/dashboard/MasterRoom.Page')),
);
const MasterSubscribePage = Loadable(
  lazy(() => import('./pages/dashboard/MasterSubscribe.Page')),
);
const GoldList = Loadable(
  lazy(() => import('./pages/dashboard/GoldList.Page')),
);
const GoldDetail = Loadable(
  lazy(() => import('./pages/dashboard/GoldDetail.Page')),
);

const CouponListPage = Loadable(
  lazy(() => import('./pages/dashboard/CouponList.Page')),
);

const CouponIssuedListPage = Loadable(
  lazy(() => import('./pages/dashboard/CouponIssuedList.Page')),
);
const PopUpCreatePage = Loadable(
  lazy(() => import('./pages/dashboard/PopUpCreate.Page')),
);
const PopUpEditPage = Loadable(
  lazy(() => import('./pages/dashboard/PopUpEdit.Page')),
);
const PopUpListPage = Loadable(
  lazy(() => import('./pages/dashboard/PopUpList.Page')),
);
const PopUpDetailPage = Loadable(
  lazy(() => import('./pages/dashboard/PopUpDetail.Page')),
);

const GroupCommentCreatePage = Loadable(
  lazy(() => import('./pages/dashboard/GroupCommentCreate.page')),
);

// Viewer pages
const HiddenboxViewer = Loadable(
  lazy(() => import('./pages/viewer/HiddenboxViewer')),
);
const TodayKeywordViewer = Loadable(
  lazy(() => import('./pages/viewer/TodayKeywordViewer')),
);

const NewsPage = Loadable(
  lazy(() => import('./pages/dashboard/News.Page')),
);

const GroupListPage = Loadable(
  lazy(() => import('./pages/dashboard/GroupList.Page')),
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
        path: 'hiddenreports',
        children: [
          {
            path: '/',
            element: <HiddenReportList />,
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
            path: ':reportId',
            element: <HiddenboxDetails />,
          },
          {
            path: ':hiddenboxId/edit',
            element: <HiddenboxEdit />,
          },
          {
            path: 'new',
            element: <HiddenReportCreate />,
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
