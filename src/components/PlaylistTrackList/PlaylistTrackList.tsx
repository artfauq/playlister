import React from 'react';

import { Badge, HStack, Icon, Image, Text } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/table-core';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { RxClock } from 'react-icons/rx';

import { Loader } from '@src/components/Loader';
import { Table } from '@src/components/Table';
import { useAppTranslation } from '@src/hooks';
import { DuplicateTrack, TrackWithAudioFeatures } from '@src/types';
import { parseTrackDuration } from '@src/utils';

type Props = {
  tracks?: TrackWithAudioFeatures[];
  duplicatedTracks?: DuplicateTrack[];
};

export const PlaylistTrackList: React.FC<Props> = ({ tracks, duplicatedTracks }) => {
  const { t } = useAppTranslation();

  const columnHelper = createColumnHelper<TrackWithAudioFeatures>();

  // TODO: be able to customize displayed columns

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Array<ColumnDef<TrackWithAudioFeatures, any>> = [
    columnHelper.accessor<'name', string>('name', {
      id: 'name',
      header: t('tracks:table.header.name'),
      cell: ({ getValue, row }) => {
        const { album } = row.original;

        return (
          <HStack>
            {album.images.length && (
              <Image src={album.images[0].url} alt={album.name} boxSize={12} objectFit="cover" />
            )}
            <Text isTruncated>{getValue()}</Text>
          </HStack>
        );
      },
      enableSorting: true,
      maxSize: 300,
    }),
    columnHelper.accessor<'artists', SpotifyApi.ArtistObjectSimplified[]>('artists', {
      id: 'artist',
      header: t('tracks:table.header.artist'),
      cell: ({ getValue }) => <Text isTruncated>{getValue()[0].name}</Text>,
      enableSorting: true,
      sortingFn: (a, b) => a.original.artists[0].name.localeCompare(b.original.artists[0].name),
      maxSize: 200,
    }),
    columnHelper.accessor<'album.name', string>('album.name', {
      id: 'album',
      header: t('tracks:table.header.album'),
      cell: ({ getValue }) => <Text isTruncated>{getValue()}</Text>,
      enableSorting: true,
      sortingFn: (a, b) => a.original.album.name.localeCompare(b.original.album.name),
      maxSize: 200,
    }),
    columnHelper.accessor<'audioFeatures', SpotifyApi.AudioFeaturesObject | undefined>(
      'audioFeatures',
      {
        id: 'tempo',
        header: t('tracks:table.header.tempo'),
        cell: ({ getValue }) => {
          const audioFeatures = getValue();

          return audioFeatures?.tempo ? audioFeatures.tempo.toFixed(0) : '-';
        },
        enableSorting: true,
        sortDescFirst: true,
        meta: {
          isNumeric: true,
        },
        maxSize: 100,
      },
    ),
    columnHelper.accessor<'durationMs', number>('durationMs', {
      id: 'duration',
      header: () => <Icon as={RxClock} boxSize={4} />,
      cell: ({ getValue }) => parseTrackDuration(getValue()),
      enableSorting: true,
      meta: {
        isNumeric: true,
      },
      maxSize: 100,
    }),
    columnHelper.display({
      id: 'saved',
      cell: ({ row }) => {
        const { isSaved } = row.original;

        return <Icon as={isSaved ? MdFavorite : MdFavoriteBorder} boxSize={4} color="red" />;
      },
    }),
    columnHelper.display({
      id: 'duplicate',
      cell: ({ row }) => {
        const { id } = row.original;
        const suspectedDuplicate = duplicatedTracks?.find(track => track.id === id);

        console.log('suspectedDuplicate', suspectedDuplicate);

        return (
          suspectedDuplicate && (
            <Badge
              borderRadius="full"
              colorScheme="orange"
              fontSize="2xs"
              fontWeight="semibold"
              lineHeight="base"
              px="2"
            >
              {suspectedDuplicate.duplicateReason}
            </Badge>
          )
        );
      },
    }),
  ];

  if (tracks) {
    return <Table columns={columns} data={tracks} defaultSort={[{ id: 'name', desc: false }]} />;
  }

  return <Loader fullScreen loadingText={t('tracks:fetching')} />;
};
