import { extendBaseTheme } from '@chakra-ui/react';
import { ChakraTheme } from '@chakra-ui/theme';

import { colors } from './colors';
import { components } from './components';
import { typography } from './typography';

const theme: Partial<ChakraTheme> = {
  colors,
  components,
  styles: {
    global: props => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.900' : 'gray.50',
      },
    }),
  },
  ...typography,
};

export default extendBaseTheme(theme);
