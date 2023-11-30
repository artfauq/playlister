import React from 'react';

import { Button, Icon, useColorMode } from '@chakra-ui/react';
import { GoMoon, GoSun } from 'react-icons/go';

type Props = {};

export const ColorModeSelector: React.FC<Props> = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Button onClick={toggleColorMode}>
      <Icon as={colorMode === 'light' ? GoMoon : GoSun} />
    </Button>
  );
};
