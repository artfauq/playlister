import { NextPage } from 'next';
import React, { useEffect, useState } from 'react';

import { Heading, HStack, Skeleton, Text, VStack } from '@chakra-ui/react';

import { Layout } from '@src/components';
import { PlaylistSelect } from '@src/components/PlaylistSelect';
import { usePlaylists } from '@src/hooks';

const DeduplicatePlaylistPage: NextPage = () => {
  const { data: playlists, status } = usePlaylists();
  const [playlistId, setPlaylistId] = useState<string>();
  const [toComparePlaylistIds, setToComparePlaylistIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (status !== 'success') {
    return (
      <VStack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </VStack>
    );
  }

  return (
    <Layout>
      <Heading as="h1" mb={8} size="2xl">
        Deduplicate
      </Heading>

      <HStack spacing={12}>
        <VStack align="flex-start" flex={1}>
          <Text>Select a playlist to remove duplicates from</Text>
          <PlaylistSelect playlists={playlists} onChange={setPlaylistId} />
        </VStack>

        <VStack align="flex-start" flex={1}>
          <Text>Select one or multiple playlists to search duplicates from</Text>
          <PlaylistSelect playlists={playlists} multiple onChange={setToComparePlaylistIds} />
        </VStack>
      </HStack>

      {playlistId && toComparePlaylistIds.length && (
        <Text>
          Show tracks from {playlistId} that are also in {toComparePlaylistIds.join(', ')}
        </Text>
      )}
    </Layout>
  );
};

export default DeduplicatePlaylistPage;
