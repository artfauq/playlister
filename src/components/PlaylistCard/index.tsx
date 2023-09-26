import React from 'react';

import { Card, CardProps } from '@chakra-ui/react';

import { PlaylistHeader, PlaylistHeaderProps } from '@src/components/PlaylistHeader';

type Props = PlaylistHeaderProps & {
  isSelected?: boolean;
} & CardProps;

export const PlaylistCard: React.FC<Props> = ({ playlist, isSelected, ...rest }) => {
  return (
    <Card overflow="hidden" variant="elevated" {...rest}>
      <PlaylistHeader
        playlist={playlist}
        bg={isSelected ? 'green.200' : 'transparent'}
        coverSize="sm"
      />
    </Card>
  );
};
