import React from 'react';

import { Center, Spinner, SpinnerProps } from '@chakra-ui/react';

type Props = SpinnerProps & {
  fullScreen?: boolean;
};

export const Loader: React.FC<Props> = ({
  color = 'spotify.green',
  size = 'md',
  fullScreen = false,
  ...rest
}) => {
  const spinner = <Spinner color={color} size={size} {...rest} />;

  return fullScreen ? <Center flex={1}>{spinner}</Center> : spinner;
};
