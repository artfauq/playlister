import React from 'react';

import { Heading, HStack, Icon, StackProps, Text, VStack } from '@chakra-ui/react';
import { FaUser, FaUsers } from 'react-icons/fa';

import { PlaylistCover, PlaylistCoverProps } from '@src/components/PlaylistCover';
import { PlaylistPublicBadge } from '@src/components/PlaylistPublicBadge';
import { PlaylistTrackCount } from '@src/components/PlaylistTrackCount';
import { useAppTranslation } from '@src/hooks';
import { Playlist } from '@src/types';

export type PlaylistHeaderProps = {
  playlist: Pick<Playlist, 'name' | 'coverImage' | 'followers' | 'public' | 'trackCount'> & {
    owner?: Pick<Playlist['owner'], 'name'>;
  };
  coverSize?: PlaylistCoverProps['size'];
};

type Props = PlaylistHeaderProps & StackProps;

export const PlaylistHeader: React.FC<Props> = ({ playlist, coverSize, ...rest }) => {
  const { t } = useAppTranslation();

  return (
    <HStack align="center" spacing="2" {...rest}>
      <PlaylistCover coverImage={playlist.coverImage} name={playlist.name} size={coverSize} />
      <VStack align="flex-start" px="2" spacing="1">
        <Heading size="sm" noOfLines={1}>
          {playlist.name}
        </Heading>
        <HStack spacing="1">
          {playlist.public != null && <PlaylistPublicBadge public={playlist.public} />}
          <PlaylistTrackCount count={playlist.trackCount} />
        </HStack>
        {playlist.owner?.name && (
          <HStack spacing="0" mt="1">
            <Icon as={FaUser} boxSize={3} color="gray.400" />
            <Text color="gray.500" fontSize="sm" lineHeight="none" px="1">
              {playlist.owner.name}
            </Text>
          </HStack>
        )}
        {playlist.followers != null && (
          <HStack spacing="0">
            <Icon as={FaUsers} />
            <Text color="gray.700" fontSize="sm" lineHeight="none" px="1">
              {t('playlists:details.followers', { count: playlist.followers })}
            </Text>
          </HStack>
        )}
      </VStack>
    </HStack>
  );
};
