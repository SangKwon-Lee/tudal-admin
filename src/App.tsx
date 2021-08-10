import { useEffect } from 'react';
import type { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import { ThemeProvider } from '@material-ui/core';
import './i18n';
import GlobalStyles from './components/layout/GlobalStyles';
import RTL from './components/layout/RTL';
import SettingsDrawer from './components/layout/SettingsDrawer';
import SplashScreen from './components/layout/SplashScreen';
import { gtmConfig } from './config';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import gtm from './lib/gtm';
import routes from './routes';
import { createTheme } from './theme';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import SocketProvider from './contexts/SocketContext';

let koLocale = require('moment/locale/ko');
moment.locale('ko', koLocale);

const App: FC = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();
  useScrollReset();

  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);

  const theme = createTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  return (
    <ThemeProvider theme={theme}>
      <MuiPickersUtilsProvider utils={MomentUtils} locale="ko_Kr">
        <RTL direction={settings.direction}>
          <SnackbarProvider dense maxSnack={3}>
            <SocketProvider>
              <GlobalStyles />
              {auth.isInitialized ? content : <SplashScreen />}
            </SocketProvider>
          </SnackbarProvider>
        </RTL>
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
};

export default App;
