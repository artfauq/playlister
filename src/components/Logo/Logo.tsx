import React, { useMemo } from 'react';

import { HStack, Image, StackProps, Text, TypographyProps } from '@chakra-ui/react';

import { appConfig } from '@src/config';

type Props = StackProps & {
  size?: 'sm' | 'md' | 'lg';
};

export const Logo: React.FC<Props> = ({ size = 'md', ...rest }) => {
  const { fontSize, imageSize, lineHeight } = useMemo<{
    fontSize: TypographyProps['fontSize'];
    lineHeight: TypographyProps['lineHeight'];
    imageSize: string;
  }>(() => {
    switch (size) {
      case 'sm':
        return {
          fontSize: 'md',
          lineHeight: 'base',
          imageSize: '1.5rem',
        };

      case 'lg':
        return {
          fontSize: 'xl',
          lineHeight: 'taller',
          imageSize: '2.5rem',
        };

      default:
        return {
          fontSize: 'lg',
          lineHeight: 'tall',
          imageSize: '2rem',
        };
    }
  }, [size]);

  return (
    <HStack align="center" {...rest}>
      <Image
        src="/images/logo.png"
        alt="Spotify Logo"
        placeholder="blur"
        w={imageSize}
        h={imageSize}
      />
      <Text fontSize={fontSize} fontWeight="semibold" lineHeight={lineHeight}>
        {appConfig.appName}
      </Text>
    </HStack>
  );
};
