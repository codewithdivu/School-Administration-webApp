// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import { UserProfileProvider } from './contexts/userContext';
import { ThemeModeProvider } from './contexts/useThemes';

// ----------------------------------------------------------------------

export default function App() {
  return (
    <ThemeModeProvider>
      <UserProfileProvider>
        <ThemeProvider>
          <ScrollToTop />
          <BaseOptionChartStyle />
          <Router />
        </ThemeProvider>
      </UserProfileProvider>
    </ThemeModeProvider>
  );
}
