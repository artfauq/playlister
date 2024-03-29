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
      colorScheme="orange"
      fontSize="2xs"
      fontWeight="semibold"
      lineHeight="base"
      px="2"
    >
      {t('playlists:details.trackCount', { count })}
    </Badge>
  );
};
