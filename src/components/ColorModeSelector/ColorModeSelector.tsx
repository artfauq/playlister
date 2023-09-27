import React from 'react';

import { FormControl, FormLabel, Switch, useColorMode } from '@chakra-ui/react';

type Props = {};

export const ColorModeSelector: React.FC<Props> = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor="colorMode">Dark mode</FormLabel>
      <Switch
        id="colorMode"
        isChecked={colorMode === 'dark'}
        onChange={toggleColorMode}
        colorScheme="teal"
      />
    </FormControl>
  );
};
