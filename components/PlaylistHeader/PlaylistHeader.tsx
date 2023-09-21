import React from 'react';

import { Heading, HStack, StackProps, VStack } from '@chakra-ui/react';

import { PlaylistCover } from '@src/components/PlaylistCover';
import { PlaylistTrackCount } from '@src/components/PlaylistTrackCount';
import { Playlist } from '@src/types';

type Props = StackProps & {
  playlist: Pick<Playlist, 'coverImage' | 'name' | 'trackCount'>;
};

export const PlaylistHeader: React.FC<Props> = ({ playlist, ...rest }) => {
  return (
    <HStack align="center" spacing="2" {...rest}>
      <PlaylistCover coverImage={playlist.coverImage} name={playlist.name} />
      <VStack align="flex-start" px="2" spacing="1">
        <Heading size="sm" noOfLines={1}>
          {playlist.name}
        </Heading>
        <PlaylistTrackCount count={playlist.trackCount} />
      </VStack>
    </HStack>
  );
};
