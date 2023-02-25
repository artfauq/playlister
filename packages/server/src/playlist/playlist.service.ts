import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { LoggerService } from 'logger/logger.service';
import { catchError, firstValueFrom } from 'rxjs';
import { UserService } from 'user/user.service';
import { delayedPromises, splitArrayIntoChunks } from 'utils';

const UNCLASSIFIED_PLAYLIST_NAME = 'Unclassified';

@Injectable()
export class PlaylistService {
  constructor(
    private httpService: HttpService,
    private logger: LoggerService,
    private userService: UserService,
  ) {}

  /**
   * Creates a new playlist for the current user.
   */
  async createPlaylist({ token, name }: { token: string; name: string }) {
    const { id: userId } = await this.userService.getUserProfile(token);

    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      name,
      public: false,
    };

    const { data: playlist } = await firstValueFrom(
      this.httpService
        .post<SpotifyApi.CreatePlaylistResponse>(`/users/${userId}/playlists`, { data, headers })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.log(error?.response?.data);

            throw new Error('Failed creating playlist');
          }),
        ),
    );

    return playlist;
  }

  async emptyPlaylist({
    token,
    playlist,
  }: {
    token: string;
    playlist: SpotifyApi.PlaylistObjectSimplified;
  }) {
    const playlistTracks = await this.getPlaylistTracks({
      token,
      playlistHref: playlist.tracks.href,
    });

    await delayedPromises(
      splitArrayIntoChunks(playlistTracks, 100).map(chunk =>
        this.removeTracksFromPlaylist({ token, playlist, tracks: chunk }),
      ),
    );
  }

  async cleanPlaylist({
    token,
    playlistName,
    playlistNames = [],
  }: {
    token: string;
    playlistName: string;
    playlistNames?: string[];
  }) {
    const playlists = await this.getUserPlaylists({ token });

    this.logger.log(`\nRetrieved ${playlists.length} playlists\n`);

    const toCleanPlaylist = playlists.find(playlist => playlist.name === playlistName);
    const searchPlaylists = playlists.filter(
      playlist =>
        playlist.name !== playlistName &&
        (playlistNames.length === 0 || playlistNames?.includes(playlist.name)),
    );

    if (!toCleanPlaylist) {
      throw new BadRequestException(`Playlist '${playlistName}' does not exist`);
    }

    if (!searchPlaylists.length) {
      throw new BadRequestException(`Found no playlist to search through`);
    }

    const playlistTracks = await this.getPlaylistTracks({
      token,
      playlistHref: toCleanPlaylist.tracks.href,
    });

    this.logger.log(
      `\nFound ${playlistTracks.length} song(s) in playlist ${toCleanPlaylist.name}\n`,
    );

    const searchPromises = searchPlaylists.map(playlist =>
      this.getPlaylistTracks({ token, playlistHref: playlist.tracks.href }),
    );

    const searchTracks = ([] as Array<SpotifyApi.PlaylistTrackObject>).concat(
      ...(await delayedPromises(searchPromises)),
    );

    this.logger.log(
      `\nFound ${searchTracks.length} song(s) in playlist(s): ${searchPlaylists
        .map(playlist => playlist.name)
        .join(', ')}\n`,
    );

    const toDeleteTracks = playlistTracks.filter(
      ({ track: t1 }) =>
        !t1.is_local &&
        searchTracks.find(
          ({ track: t2 }) =>
            t1.uri === t2.uri ||
            (t1.name.toLowerCase() === t2.name.toLowerCase() &&
              t1.artists.map(artist => artist.name).join(',') ===
                t2.artists.map(artist => artist.name).join(',')),
        ),
    );

    if (toDeleteTracks.length === 0) {
      this.logger.log(`Playlist already clean ✅`);

      return;
    }

    // Remove tracks by chunks of 100
    await delayedPromises(
      splitArrayIntoChunks(toDeleteTracks, 100).map(chunk =>
        this.removeTracksFromPlaylist({ token, playlist: toCleanPlaylist, tracks: chunk }),
      ),
    );

    this.logger.log(`✅ Successfully removed ${toDeleteTracks.length} song(s):`);

    toDeleteTracks.forEach(track => {
      this.logger.log(
        `- ${track.track.artists.map(artist => artist.name).join(' + ')} - ${track.track.name}`,
      );
    });
  }

  /**
   * Returns all the playlists of the user.
   */
  async getUserPlaylists({
    token,
    chunk = [],
  }: {
    token: string;
    chunk?: Array<SpotifyApi.PlaylistObjectSimplified>;
  }): Promise<Array<SpotifyApi.PlaylistObjectSimplified>> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>('/me/playlists', {
          params: { limit: 50 },
          headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.log(error?.response?.data);

            throw new Error('Failed retrieving user playlists');
          }),
        ),
    );

    const playlists = [...chunk, ...data.items];

    return data.next ? this.getUserPlaylists({ token, chunk: playlists }) : playlists;
  }

  /**
   * Returns all the tracks of a playlist.
   */
  async getPlaylistTracks({
    token,
    playlistHref,
    chunk = [],
  }: {
    token: string;
    playlistHref: string;
    chunk?: Array<SpotifyApi.PlaylistTrackObject>;
  }): Promise<Array<SpotifyApi.PlaylistTrackObject>> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const { data } = await firstValueFrom(
      this.httpService
        .get<SpotifyApi.PlaylistTrackResponse>(playlistHref, {
          params: { limit: 50 },
          headers,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.log(error?.response?.data);

            throw new Error('Failed retrieving tracks');
          }),
        ),
    );

    // Retrieve tracks from response and sort them by name
    const tracks = [...chunk, ...data.items].sort(({ track: trackA }, { track: trackB }) =>
      trackA.name.localeCompare(trackB.name),
    );

    this.logger.log(`👊 Retrieved ${tracks.length} / ${data.total} tracks`);

    if (data.next) {
      return this.getPlaylistTracks({ token, playlistHref: data.next, chunk: tracks });
    }

    return tracks;
  }

  /**
   * Adds specified `tracks` of a playlist.
   */
  async addTracksToPlaylist({
    token,
    playlist,
    tracks,
  }: {
    token: string;
    playlist: SpotifyApi.PlaylistObjectSimplified;
    tracks: Array<SpotifyApi.PlaylistTrackObject>;
  }): Promise<void> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      uris: tracks.map(track => track.track.linked_from?.uri || track.track.uri),
    };

    await firstValueFrom(
      this.httpService
        .post<SpotifyApi.RemoveTracksFromPlaylistResponse>(playlist.tracks.href, data, { headers })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.log(error?.response?.data);

            throw new Error('Failed adding tracks to unclassified playlist');
          }),
        ),
    );
  }

  /**
   * Removes specified tracks from the playlist.
   */
  async removeTracksFromPlaylist({
    token,
    playlist,
    tracks,
  }: {
    token: string;
    playlist: SpotifyApi.PlaylistObjectSimplified;
    tracks: Array<SpotifyApi.PlaylistTrackObject>;
  }): Promise<void> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      tracks: tracks.map(track => ({ uri: track.track.linked_from?.uri || track.track.uri })),
    };

    await firstValueFrom(
      this.httpService
        .delete<SpotifyApi.RemoveTracksFromPlaylistResponse>(playlist.tracks.href, {
          data,
          headers,
          timeout: 50000,
        })
        .pipe(
          catchError((error: AxiosError) => {
            this.logger.log(error?.response?.data);

            throw error;
          }),
        ),
    );
  }

  async saveUnclassified({ token }: { token: string }) {
    const savedTracks = await this.getPlaylistTracks({ token, playlistHref: '/me/tracks' });

    this.logger.log(`\n👊 Retrieved ${savedTracks.length} saved tracks...`);

    const playlists = await this.getUserPlaylists({ token });

    const getPromises = playlists
      .filter(playlist => playlist.name !== UNCLASSIFIED_PLAYLIST_NAME)
      .map(playlist => this.getPlaylistTracks({ token, playlistHref: playlist.tracks.href }));

    const playlistTracks = ([] as Array<SpotifyApi.PlaylistTrackObject>).concat(
      ...(await delayedPromises(getPromises)),
    );

    this.logger.log(`👊 Retrieved ${savedTracks.length} tracks from all playlists...`);

    // Retrieve or create unclassified playlist
    const unclassifiedPlaylist =
      playlists.find(p => p.name === UNCLASSIFIED_PLAYLIST_NAME) ||
      (await this.createPlaylist({ token, name: UNCLASSIFIED_PLAYLIST_NAME }));

    // Retrieve or create unclassified playlist tracks
    const unclassifiedTracks = savedTracks.filter(
      savedTrack =>
        !playlistTracks.find(playlistTrack => playlistTrack.track.uri === savedTrack.track.uri),
    );

    this.logger.log(`👊 Found ${unclassifiedTracks.length} unclassified tracks...`);

    await this.emptyPlaylist({ token, playlist: unclassifiedPlaylist });

    this.logger.log('👊 Finished emptying playlist...');

    const addPromises = splitArrayIntoChunks(unclassifiedTracks, 100).map(chunk =>
      this.addTracksToPlaylist({ token, playlist: unclassifiedPlaylist, tracks: chunk }),
    );

    await delayedPromises(addPromises);

    this.logger.log('✅ All done\n');
  }
}
