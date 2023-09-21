import React from 'react';

import { Image } from '@chakra-ui/react';

export type PlaylistCoverProps = {
  coverImage: string;
  name: string;
  size?: string;
};

export const PlaylistCover: React.FC<PlaylistCoverProps> = ({
  coverImage,
  name,
  size = '80px',
}) => {
  return <Image src={coverImage} alt={name} height={size} width={size} />;
};
