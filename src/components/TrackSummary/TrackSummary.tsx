import React from 'react';

import { Stack, Text, VStack } from '@chakra-ui/react';

import { TrackCover } from '@src/components/TrackCover';
import { Track } from '@src/types';

type Props = {
  align: 'left' | 'right';
  track: Track;
};

export const TrackSummary: React.FC<Props> = ({ align, track }) => {
  const alignRight = align === 'right';

  return (
    <Stack direction={alignRight ? 'row-reverse' : 'row'}>
      <TrackCover track={track} />
      <VStack align="stretch" spacing="0">
        <Text fontSize="sm" fontWeight="semibold" lineHeight="short" textAlign={align}>
          {track.name}
        </Text>
        <Text fontSize="sm" lineHeight="short" noOfLines={1} textAlign={align}>
          {track.artists[0].name}
        </Text>
        <Text fontSize="xs" lineHeight="short" textAlign={align}>
          {track.album.name}
        </Text>
      </VStack>
    </Stack>
  );
};
