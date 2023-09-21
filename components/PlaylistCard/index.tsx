import React from 'react';

import { Card, CardProps } from '@chakra-ui/react';

import { PlaylistHeader } from '@src/components/PlaylistHeader';
import { Playlist } from '@src/types';

type Props = CardProps & {
  playlist: Pick<Playlist, 'coverImage' | 'name' | 'trackCount'>;
  isSelected?: boolean;
};

export const PlaylistCard: React.FC<Props> = ({ playlist, isSelected, ...rest }) => {
  return (
    <Card overflow="hidden" variant="elevated" {...rest}>
      <PlaylistHeader playlist={playlist} bg={isSelected ? 'green.200' : 'transparent'} />
    </Card>
  );
};
