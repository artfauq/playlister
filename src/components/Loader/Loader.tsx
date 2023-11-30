import React from 'react';

import { Center, Spinner, SpinnerProps, Text, VStack } from '@chakra-ui/react';

type Props = SpinnerProps & {
  fullScreen?: boolean;
  loadingText?: string;
};

export const Loader: React.FC<Props> = ({
  size = 'md',
  fullScreen = false,
  loadingText,
  ...rest
}) => {
  const spinner = (
    <VStack>
      <Spinner colorScheme="spotify" size={size} {...rest} />
      {loadingText && (
        <Text color="gray.500" fontSize="sm">
          {loadingText}
        </Text>
      )}
    </VStack>
  );

  return fullScreen ? <Center flex={1}>{spinner}</Center> : spinner;
};
