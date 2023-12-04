import React from 'react';

import { HStack, Icon, IconButton, Image, Text } from '@chakra-ui/react';
import { ColumnDef } from '@tanstack/table-core';
import { CiTrash } from 'react-icons/ci';
import { MdFavorite, MdFavoriteBorder } from 'react-icons/md';
import { RxClock } from 'react-icons/rx';

import { Loader } from '@src/components/Loader';
import { Table } from '@src/components/Table';
import { useAppTranslation } from '@src/hooks';
import { Track, TrackWithAudioFeatures } from '@src/types';
import { parseTrackDuration } from '@src/utils';

// type Props<T extends Track> = {
//   tracks?: T[];
//   // duplicatedTracks?: DuplicateTrack[];
//   withAudioFeatures?: boolean;
//   onDelete?: (track: T) => void;
// };

const tracksHaveAudioFeatures = <T extends Track>(
  tracks: Array<T | TrackWithAudioFeatures>,
): tracks is TrackWithAudioFeatures[] => tracks && 'audioFeatures' in tracks[0];

type Props<T extends Track> = {
  tracks?: T[];
  onDelete?: (track: T) => void;
};

export function PlaylistTrackList<T extends Track>({ tracks, onDelete }: Props<T>) {
  const { t } = useAppTranslation();

  const withAudioFeatures = tracks ? tracksHaveAudioFeatures(tracks) : false;

  const columns: Array<ColumnDef<T, any>> = [
    {
      id: 'name',
      accessorKey: 'name',
      header: t('tracks:table.header.name'),
      cell: ({ row }) => {
        const { album, artists, name } = row.original;

        return (
          <HStack>
            {album.images.length && (
              <Image src={album.images[0].url} alt={album.name} boxSize={12} objectFit="cover" />
            )}
            <Text isTruncated>
              <Text as="span">{name}</Text>
              <br />
              <Text as="span" fontWeight="semibold">
                {artists[0].name}
              </Text>
            </Text>
          </HStack>
        );
      },
      enableSorting: true,
      maxSize: 250,
    },
    {
      id: 'album',
      header: t('tracks:table.header.album'),
      accessorKey: 'album.name',
      cell: ({ getValue }) => <Text isTruncated>{getValue<string>()}</Text>,
      enableSorting: true,
      sortingFn: (a, b) => a.original.album.name.localeCompare(b.original.album.name),
      maxSize: 400,
    },
    ...(withAudioFeatures
      ? [
          {
            id: 'tempo',
            header: t('tracks:table.header.tempo'),
            accessorFn: (track: TrackWithAudioFeatures) => track.audioFeatures?.tempo,
            cell: ({ getValue }) => getValue<number | undefined>()?.toFixed(0) ?? '-',
            enableSorting: true,
            sortDescFirst: true,
            meta: {
              isNumeric: true,
            },
            maxSize: 80,
          } as ColumnDef<T, any>,
        ]
      : []),
    {
      id: 'duration',
      accessorKey: 'durationMs',
      header: () => <Icon as={RxClock} boxSize={4} />,
      cell: ({ getValue }) => parseTrackDuration(getValue<number>()),
      enableSorting: true,
      meta: {
        isNumeric: true,
      },
      maxSize: 60,
    },
    {
      id: 'saved',
      cell: ({ row }) => {
        return (
          <Icon as={row.original.isSaved ? MdFavorite : MdFavoriteBorder} boxSize={4} color="red" />
        );
      },
      meta: {
        isNumeric: true,
      },
      maxSize: 50,
    },
    ...(onDelete
      ? [
          {
            id: 'delete',
            cell: ({ row }) => {
              return (
                <IconButton
                  aria-label="Remove track"
                  color="red"
                  icon={<CiTrash />}
                  fontSize="sm"
                  onClick={() => onDelete(row.original)}
                  variant="outline"
                />
              );
            },
          } as ColumnDef<T, any>,
        ]
      : []),
  ];

  if (tracks) {
    return <Table columns={columns} data={tracks} />;
  }

  return <Loader fullScreen loadingText={t('tracks:fetching')} />;
}
