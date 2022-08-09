// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import {UserProfileProvider } from './contexts/userContext';

// ----------------------------------------------------------------------

export default function App() {

  return (
    <UserProfileProvider>
      <ThemeProvider>
        <ScrollToTop />
        <BaseOptionChartStyle />
        <Router />
      </ThemeProvider>
    </UserProfileProvider>
  );
}
