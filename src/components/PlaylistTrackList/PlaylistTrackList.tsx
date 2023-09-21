import React from 'react';

import { Card, Icon, Text } from '@chakra-ui/react';
import { ColumnDef, createColumnHelper } from '@tanstack/table-core';
import { RxClock } from 'react-icons/rx';

import { Table } from '@src/components/Table';
import { useAppTranslation } from '@src/hooks';
import { TrackWithAudioFeatures } from '@src/types';
import { parseTrackDuration } from '@src/utils';

type Props = {
  tracks: TrackWithAudioFeatures[];
};

export const PlaylistTrackList: React.FC<Props> = ({ tracks }) => {
  const { t } = useAppTranslation();

  const columnHelper = createColumnHelper<TrackWithAudioFeatures>();

  // TODO: be able to customize displayed columns

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: Array<ColumnDef<TrackWithAudioFeatures, any>> = [
    columnHelper.accessor<'name', string>('name', {
      id: 'name',
      header: t('tracks:table.header.name'),
      cell: ({ getValue }) => <Text isTruncated>{getValue()}</Text>,
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
  ];

  return (
    <Card>
      <Table columns={columns} data={tracks} defaultSort={[{ id: 'name', desc: false }]} />
    </Card>
  );
};
