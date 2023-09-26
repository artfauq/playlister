import { extendBaseTheme, ThemeConfig } from '@chakra-ui/react';
import { ChakraTheme } from '@chakra-ui/theme';

import { colors } from './colors';
import { components } from './components';
import { typography } from './typography';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme: Partial<ChakraTheme> = {
  colors,
  config,
  components,
  ...typography,
};

export default extendBaseTheme(theme);
