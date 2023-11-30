import { extendBaseTheme, Theme, ThemeConfig } from '@chakra-ui/react';
import { ChakraTheme } from '@chakra-ui/theme';
import { mode } from '@chakra-ui/theme-tools';

import { colors } from './colors';
import { components } from './components';
import { typography } from './typography';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

const theme: Partial<ChakraTheme> = {
  colors,
  config,
  components,
  ...typography,
  styles: {
    global: props => ({
      body: {
        bgGradient: mode(
          'linear(to-b, gray.50, gray.100)',
          'linear(to-b, gray.700, gray.800)',
        )(props),
        minH: '100vh',
      },
    }),
  },
};

export default extendBaseTheme(theme) as Theme;
