import { createQueryKeyStore } from '@lukemorales/query-key-factory';
import type { QueryClientConfig } from '@tanstack/react-query';
import ms from 'ms';

export const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      cacheTime: ms('1w'),
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: false,
      staleTime: ms('1m'),
    },
  },
};

export const queryKeys = createQueryKeyStore({
  playlists: {
    all: null,
    details: (playlistId: string) => [playlistId],
    tracks: (playlistId: string) => [playlistId],
  },
  topTracks: {
    list: (filters: { offset?: number; limit?: number }) => ['topTracks', filters],
  },
  savedTracks: {
    all: null,
    list: (filters: { offset?: number; limit?: number }) => ['savedTracks', filters],
    count: () => ['savedTracks', 'count'],
  },
  tracksAudioFeatures: {
    list: (trackIds: string[]) => ['tracksAudioFeatures', trackIds],
  },
  unclassifiedTracks: null,
});
