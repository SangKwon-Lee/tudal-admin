import { Suspense, lazy } from 'react';
import type { PartialRouteObject } from 'react-router';
import { Navigate } from 'react-router-dom';
import AuthGuard from './components/guards/AuthGuard';
import DashboardLayout from './components/dashboard/DashboardLayout';
import GuestGuard from './components/guards/GuestGuard';
import LoadingScreen from './components/layout/LoadingScreen';
import MainLayout from './components/layout/MainLayout';
import News from './pages/dashboard/News';

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
  lazy(() => import('./pages/dashboard/Overview')),
);
const ReportMaker = Loadable(
  lazy(() => import('./pages/dashboard/ReportMaker')),
);
const ScheduleList = Loadable(
  lazy(() => import('./pages/dashboard/Schedule.Page')),
);
const StockList = Loadable(
  lazy(() => import('./pages/dashboard/Stock')),
);
const KeywordList = Loadable(
  lazy(() => import('./pages/dashboard/Keyword')),
);
const CategoryList = Loadable(
  lazy(() => import('./pages/dashboard/Category')),
);

const GoldList = Loadable(
  lazy(() => import('./pages/dashboard/GoldList.Page')),
);
const GoldDetail = Loadable(
  lazy(() => import('./pages/dashboard/GoldDetail.Page')),
);

// const ExpertsList = Loadable(
//   lazy(() => import('./pages/dashboard/ExpertsList')),
// );
// const ExpertCreate = Loadable(
//   lazy(() => import('./pages/dashboard/ExpertCreate')),
// );

// Viewer pages
const HiddenboxViewer = Loadable(
  lazy(() => import('./pages/viewer/HiddenboxViewer')),
);
const TodayKeywordViewer = Loadable(
  lazy(() => import('./pages/viewer/TodayKeywordViewer')),
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
            element: <News />,
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
            element: <KeywordList />,
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
      // {
      //   path: 'experts',
      //   children: [
      //     {
      //       path: '/',
      //       element: <ExpertsList />,
      //     },
      //     {
      //       path: '/new',
      //       element: <ExpertCreate />,
      //     },
      //   ],
      // },
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
