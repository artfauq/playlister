export enum AppRoute {
  Index = 'Index',
  Deduplicate = 'Deduplicate',
  Playlist = 'Playlist',
  PlaylistsIndex = 'PlaylistsIndex',
  SavedTracks = 'SavedTracks',
  TopTracks = 'TopTracks',
  UnclassifiedTracks = 'UnclassifiedTracks',
}

const appRoutes = {
  [AppRoute.Index]: '/',
  [AppRoute.Deduplicate]: '/deduplicate',
  [AppRoute.PlaylistsIndex]: '/playlists',
  [AppRoute.Playlist]: (playlistId: string) => `/playlists/${playlistId}`,
  [AppRoute.SavedTracks]: '/saved-tracks',
  [AppRoute.TopTracks]: '/top-tracks',
  [AppRoute.UnclassifiedTracks]: '/unclassified',
};

export type AppRoutesMap = typeof appRoutes;

export function getRoute<K extends keyof typeof AppRoute>(routeName: K) {
  return appRoutes[AppRoute[routeName]];
}
