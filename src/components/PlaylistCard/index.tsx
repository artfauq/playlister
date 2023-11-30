import React from 'react';

import { Card, CardProps } from '@chakra-ui/react';

import { PlaylistHeader, PlaylistHeaderProps } from '@src/components/PlaylistHeader';

type Props = PlaylistHeaderProps & {
  isSelected?: boolean;
} & CardProps;

export const PlaylistCard: React.FC<Props> = ({ playlist, isSelected, ...rest }) => {
  const cardProps: CardProps = rest.onClick
    ? {
        cursor: 'pointer',
        transitionDuration: '0.15s',
        transitionProperty: 'box-shadow',
        transitionTimingFunction: 'ease-in-out',
        _hover: {
          shadow: 'md',
        },
      }
    : {};

  return (
    <Card overflow="hidden" variant="elevated" {...cardProps} {...rest}>
      <PlaylistHeader
        playlist={playlist}
        bg={isSelected ? 'orange.100' : 'transparent'}
        coverSize="md"
      />
    </Card>
  );
};
