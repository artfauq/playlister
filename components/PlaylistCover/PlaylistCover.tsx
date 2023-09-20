import React from 'react';

import { Image } from '@chakra-ui/react';

import { Playlist } from '@src/types';

type Props = {
  playlist: Playlist;
  size?: string;
};

export const PlaylistCover: React.FC<Props> = ({ playlist, size = '80px' }) => {
  return <Image src={playlist.images[0].url} alt={playlist.name} height={size} width={size} />;
};
