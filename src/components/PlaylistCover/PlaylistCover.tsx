import React from 'react';

import { Center, Icon, Image } from '@chakra-ui/react';
import { FaItunesNote } from 'react-icons/fa';

export type PlaylistCoverProps = {
  coverImage?: string | null;
  name: string;
  size?: 'sm' | 'md';
};

export const PlaylistCover: React.FC<PlaylistCoverProps> = ({ coverImage, name, size = 'md' }) => {
  const boxSize = size === 'sm' ? 80 : 100;

  return coverImage ? (
    <Image src={coverImage} alt={name} height={`${boxSize}px`} width={`${boxSize}px`} />
  ) : (
    <Center bg="blackAlpha.700" boxSize={`${boxSize}px`}>
      <Icon as={FaItunesNote} color="whiteAlpha.700" boxSize={`${Math.round(boxSize / 2)}px`} />
    </Center>
  );
};
