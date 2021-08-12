import { useEffect } from "react";
import type { FC } from "react";
import { useRoutes } from "react-router-dom";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@material-ui/core";
import "./i18n";
import GlobalStyles from "./components/GlobalStyles";
import RTL from "./components/RTL";
import SplashScreen from "./components/SplashScreen";
import { gtmConfig } from "./config";
import useAuth from "./hooks/useAuth";
import useScrollReset from "./hooks/useScrollReset";
import useSettings from "./hooks/useSettings";
import gtm from "./lib/gtm";
import routes from "./routes";
import { createTheme } from "./theme";
import moment from "moment";
import SocketProvider from "./contexts/SocketContext";
import AdapterMoment from "@material-ui/lab/AdapterMoment";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";

let koLocale = require("moment/locale/ko");
moment.locale("ko", koLocale);

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
      <LocalizationProvider dateAdapter={AdapterMoment} locale="ko_Kr">
        <RTL direction={settings.direction}>
          <SnackbarProvider dense maxSnack={3}>
            <SocketProvider>
              <GlobalStyles />
              {auth.isInitialized ? content : <SplashScreen />}
            </SocketProvider>
          </SnackbarProvider>
        </RTL>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
