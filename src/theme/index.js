import PropTypes from 'prop-types';
import { useMemo, useContext } from 'react';
// material
import { CssBaseline } from '@mui/material';
import { ThemeProvider as MUIThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
//
import palette from './palette';
import typography from './typography';
import componentsOverride from './overrides';
import shadows, { customShadows } from './shadows';
import { ThemeModeContext } from '../contexts/useThemes';

// ----------------------------------------------------------------------

ThemeProvider.propTypes = {
  children: PropTypes.node,
};

export default function ThemeProvider({ children }) {
  const { themeMode, setthemeMode } = useContext(ThemeModeContext);

  // console.log('palette', palette);
  const themeOptions = useMemo(
    () => ({
      palette: themeMode ? palette.dark : palette.light,
      shape: { borderRadius: 8 },
      typography,
      shadows: themeMode ? shadows.dark : shadows.light,
      customShadows: themeMode ? customShadows.dark : customShadows.light,
    }),
    [themeMode]
  );

  const theme = createTheme(themeOptions);
  // theme.pallete.mode = 'dark';
  theme.components = componentsOverride(theme);

  return (
    <StyledEngineProvider injectFirst>
      <MUIThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MUIThemeProvider>
    </StyledEngineProvider>
  );
}
