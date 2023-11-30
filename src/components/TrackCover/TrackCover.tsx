import React, { useMemo } from 'react';

import { Center, Icon, Image } from '@chakra-ui/react';
import { FaItunesNote } from 'react-icons/fa';

import { Track } from '@src/types';

type Props = {
  track: Track;
  size?: 'sm' | 'md' | 'lg';
};

export const TrackCover: React.FC<Props> = ({ track, size = 'md' }) => {
  const boxSize = useMemo(() => {
    switch (size) {
      case 'sm':
        return 40;

      case 'md':
        return 60;

      case 'lg':
        return 80;

      default:
        throw new Error('Invalid `size` property');
    }
  }, [size]);

  const imageUrl = track.album.images[0]?.url;

  return imageUrl ? (
    <Image src={imageUrl} alt={track.album.name} height={`${boxSize}px`} width={`${boxSize}px`} />
  ) : (
    <Center bg="blackAlpha.700" boxSize={`${boxSize}px`}>
      <Icon as={FaItunesNote} color="whiteAlpha.700" boxSize={`${Math.round(boxSize / 2)}px`} />
    </Center>
  );
};
