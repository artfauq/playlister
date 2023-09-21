import React, { useEffect } from 'react';

import { Text } from '@chakra-ui/react';

import { useSaveUnclassified } from '@src/hooks';
import { useUnclassifiedTracks } from '@src/hooks/useUnclassifiedTracks';

type Props = {
  unclassifiedPlaylistId: string;
  removeClassified?: boolean;
};

export const SaveUnclassified: React.FC<Props> = ({
  unclassifiedPlaylistId,
  removeClassified = true,
}) => {
  const { unclassifiedTracks, fetching } = useUnclassifiedTracks(unclassifiedPlaylistId);
  const { saveUnclassified, status: saveStatus } = useSaveUnclassified(
    unclassifiedPlaylistId,
    removeClassified,
  );

  useEffect(() => {
    if (!unclassifiedTracks?.length || saveStatus !== 'idle') return;

    saveUnclassified(unclassifiedTracks);
  }, [unclassifiedTracks, saveStatus, saveUnclassified]);

  if (fetching) {
    return <Text>Retrieving unclassified tracks...</Text>;
  }

  if (saveStatus === 'loading') {
    return <Text>Saving unclassified tracks...</Text>;
  }

  if (saveStatus === 'success') {
    return <Text>Unclassified tracks saved!</Text>;
  }

  if (saveStatus === 'error') {
    return <Text>Failed to save unclassified tracks</Text>;
  }

  return null;
};
