import React from 'react';

import { HStack, StackProps, Text, VStack } from '@chakra-ui/react';

import { TrackCover } from '@src/components/TrackCover';
import { Track } from '@src/types';

type Props = {
  track: Track;
} & StackProps;

export const TrackSummary: React.FC<Props> = ({ track, ...rest }) => {
  return (
    <HStack {...rest}>
      <TrackCover track={track} />
      <VStack align="flex-start" spacing="0">
        <Text fontSize="sm" fontWeight="semibold" lineHeight="short">
          {track.name}
        </Text>
        <Text fontSize="sm" lineHeight="short" noOfLines={1}>
          {track.artists[0].name}
        </Text>
        <Text fontSize="xs" lineHeight="short">
          {track.album.name}
        </Text>
      </VStack>
    </HStack>
  );
};
