import type { Parameters, Preview } from '@storybook/react';
import theme from '../src/theme';

const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  chakra: {
    theme: theme,
  },
};

const preview: Preview = {
  parameters,
};

export default preview;
