import React, { useMemo } from 'react';

import { Center, Icon, Image } from '@chakra-ui/react';
import { FaItunesNote } from 'react-icons/fa';

export type PlaylistCoverProps = {
  imageUrl?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg';
};

export const PlaylistCover: React.FC<PlaylistCoverProps> = ({ imageUrl, alt, size = 'md' }) => {
  const boxSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 40;

      case 'md':
        return 80;

      case 'lg':
        return 120;

      default:
        throw new Error('Invalid `size` property');
    }
  }, [size]);

  return imageUrl ? (
    <Image src={imageUrl} alt={alt} height={`${boxSize}px`} width={`${boxSize}px`} />
  ) : (
    <Center bg="blackAlpha.700" boxSize={`${boxSize}px`}>
      <Icon as={FaItunesNote} color="whiteAlpha.700" boxSize={`${Math.round(boxSize / 2)}px`} />
    </Center>
  );
};
