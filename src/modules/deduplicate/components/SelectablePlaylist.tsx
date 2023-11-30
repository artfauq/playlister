import React from 'react';

import { Card, Heading, HStack } from '@chakra-ui/react';

import { PlaylistCover } from '@src/components';
import { Playlist } from '@src/types';

type Props = {
  playlist: Playlist;
  isSelected: boolean;
  onSelect: (playlistId: string) => void;
};

export const SelectablePlaylist: React.FC<Props> = ({ playlist, isSelected, onSelect }) => {
  return (
    <Card
      as={HStack}
      bg={isSelected ? 'orange.100' : 'white'}
      flexDirection="row"
      cursor="pointer"
      onClick={() => onSelect(playlist.id)}
      overflow="hidden"
      spacing="2"
      transitionDuration="0.2s"
      transitionTimingFunction="ease-in-out"
      variant="elevated"
      _hover={{
        shadow: 'md',
      }}
    >
      <PlaylistCover imageUrl={playlist.coverImage} alt={playlist.name} size="sm" />
      <Heading size="sm" noOfLines={1}>
        {playlist.name}
      </Heading>
    </Card>
  );
};
