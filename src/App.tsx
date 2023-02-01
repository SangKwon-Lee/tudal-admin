import { useEffect } from 'react';
import type { FC } from 'react';
import { useRoutes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import './i18n';
import RTL from './components/layout/RTL';
import SplashScreen from './components/layout/SplashScreen';
import { gtmConfig } from './config';
import useAuth from './hooks/useAuth';
import useScrollReset from './hooks/useScrollReset';
import useSettings from './hooks/useSettings';
import gtm from './lib/gtm';
import routes from './routes';
import { createCustomTheme } from './theme';
import moment from 'moment';
// import SocketProvider from './contexts/SocketContext';
import AdapterMoment from '@material-ui/lab/AdapterMoment';
import LocalizationProvider from '@material-ui/lab/LocalizationProvider';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import { Provider } from 'react-redux';
import store, { persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { PriceProvider } from './contexts/price';

const koLocale = require('moment/locale/ko');
moment.locale('ko', koLocale);

const App: FC = () => {
  const content = useRoutes(routes);
  const { settings } = useSettings();
  const auth = useAuth();

  useScrollReset();

  useEffect(() => {
    gtm.initialize(gtmConfig);
  }, []);

  const theme = createCustomTheme({
    direction: settings.direction,
    responsiveFontSizes: settings.responsiveFontSizes,
    roundedCorners: settings.roundedCorners,
    theme: settings.theme,
  });

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <PriceProvider>
          <ThemeProvider theme={theme}>
            <LocalizationProvider
              dateAdapter={AdapterMoment}
              locale="ko_Kr"
            >
              <RTL direction={settings.direction}>
                {/* <SocketProvider> */}
                <CssBaseline />
                <Toaster position="top-center" />
                {auth.isInitialized ? content : <SplashScreen />}
                {/* </SocketProvider> */}
              </RTL>
            </LocalizationProvider>
          </ThemeProvider>
        </PriceProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
