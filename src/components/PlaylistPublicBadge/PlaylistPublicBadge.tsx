import React from 'react';

import { Badge } from '@chakra-ui/react';

import { useAppTranslation } from '@src/hooks';

type Props = {
  public: boolean;
};

export const PlaylistPublicBadge: React.FC<Props> = ({ public: isPublic }) => {
  const { t } = useAppTranslation();

  return (
    <Badge
      borderRadius="full"
      colorScheme="blue"
      fontSize="2xs"
      fontWeight="semibold"
      lineHeight="base"
      px="2"
    >
      {t(`playlists:details.${isPublic ? 'public' : 'private'}`)}
    </Badge>
  );
};
