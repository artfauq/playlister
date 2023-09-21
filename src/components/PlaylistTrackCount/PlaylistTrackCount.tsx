import React from 'react';

import { Badge } from '@chakra-ui/react';

import { useAppTranslation } from '@src/hooks';

type Props = {
  count: number;
};

export const PlaylistTrackCount: React.FC<Props> = ({ count }) => {
  const { t } = useAppTranslation();

  return (
    <Badge
      borderRadius="full"
      fontSize="0.65rem"
      fontWeight="semibold"
      colorScheme="orange"
      px="2"
      mb="1"
    >
      {t('playlists:tracksCount', { count })}
    </Badge>
  );
};
