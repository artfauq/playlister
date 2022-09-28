import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { UserService } from 'user/user.service';

const UNCLASSIFIED_PLAYLIST_NAME = 'Unclassified';

@Injectable()
export class PlaylistService {
  constructor(private httpService: HttpService, private userService: UserService) {}

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
      this.httpService.post<SpotifyApi.CreatePlaylistResponse>(`/users/${userId}/playlists`, {
        data,
        headers,
      }),
    );

    return playlist;
  }

  /**
   * Removes all the tracks from a playlist.
   */
  async emptyPlaylist({ token, playlistHref }: { token: string; playlistHref: string }) {
    const playlistTracks = await this.getPlaylistTracks({ token, playlistHref });

    await Promise.all(
      Array(Math.ceil(playlistTracks.length / 100))
        .fill(null)
        .map((_, index) => index * 100)
        .map(begin => playlistTracks.slice(begin, begin + 100))
        .map(chunk => this.removeTracksFromPlaylist({ token, playlistHref, tracks: chunk })),
    );
  }

  async cleanPlaylist(token: string, playlistName: string, playlistNames: string[] = []) {
    const playlists = await this.getUserPlaylists(token);

    console.log(`\nRetrieved ${playlists.length} playlists`);

    const toCleanPlaylist = playlists.find(playlist => playlist.name === playlistName);
    const searchPlaylists = playlists.filter(
      playlist =>
        playlist.name !== playlistName &&
        (playlistNames.length === 0 || playlistNames?.includes(playlist.name)),
    );

    if (!toCleanPlaylist) {
      throw new BadRequestException('Playlist not found !');
    }

    const playlistTracks = await this.getPlaylistTracks({
      token,
      playlistHref: toCleanPlaylist.tracks.href,
    });
    console.log(`\nFound ${playlistTracks.length} songs in playlist ${toCleanPlaylist.name}`);

    const searchTracks = ([] as Array<SpotifyApi.PlaylistTrackObject>).concat(
      ...(await Promise.all(
        searchPlaylists.map(playlist =>
          this.getPlaylistTracks({ token, playlistHref: playlist.tracks.href }),
        ),
      )),
    );
    console.log(
      `\nFound ${searchTracks.length} songs in playlists: ${searchPlaylists
        .map(playlist => playlist.name)
        .join(', ')}`,
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
      return;
    }

    // Remove tracks by chunks of 100
    await Promise.all(
      Array(Math.ceil(toDeleteTracks.length / 100))
        .fill(null)
        .map((_, index) => index * 100)
        .map(begin => toDeleteTracks.slice(begin, begin + 100))
        .map(chunk =>
          this.removeTracksFromPlaylist({
            token,
            playlistHref: toCleanPlaylist.href,
            tracks: chunk,
          }),
        ),
    );

    console.log(`\nSuccessfully removed ${toDeleteTracks.length} songs:`);

    toDeleteTracks.forEach(track => {
      console.log(
        `- ${track.track.artists.map(artist => artist.name).join(' + ')} - ${track.track.name}`,
      );
    });
  }

  /**
   * Returns all the playlists of the user.
   */
  async getUserPlaylists(token: string): Promise<Array<SpotifyApi.PlaylistObjectSimplified>> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get<SpotifyApi.ListOfCurrentUsersPlaylistsResponse>('/me/playlists', {
        params: { limit: 50 },
        headers,
      }),
    );

    return data.items;
  }

  /**
   * Returns all the tracks of a playlist.
   */
  async getPlaylistTracks({
    token,
    playlistHref,
    acc = [],
  }: {
    token: string;
    playlistHref: string;
    acc?: Array<SpotifyApi.PlaylistTrackObject>;
  }): Promise<Array<SpotifyApi.PlaylistTrackObject>> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get<SpotifyApi.PlaylistTrackResponse>(playlistHref, {
        params: { limit: 100 },
        headers,
      }),
    );

    // Retrieve tracks from response and sort them by name
    const tracks = [...acc, ...data.items].sort(({ track: trackA }, { track: trackB }) =>
      trackA.name.localeCompare(trackB.name),
    );

    return data.next
      ? this.getPlaylistTracks({ token, playlistHref: data.next, acc: tracks })
      : tracks;
  }

  /**
   * Adds specified `tracks` of a playlist.
   */
  async addTracksToPlaylist({
    token,
    playlistHref,
    tracks,
  }: {
    token: string;
    playlistHref: string;
    tracks: Array<SpotifyApi.PlaylistTrackObject>;
  }): Promise<void> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      tracks,
    };

    await firstValueFrom(
      this.httpService.post<SpotifyApi.RemoveTracksFromPlaylistResponse>(`${playlistHref}/tracks`, {
        data,
        headers,
      }),
    );
  }

  /**
   * Removes specified tracks from the playlist.
   */
  async removeTracksFromPlaylist({
    token,
    playlistHref,
    tracks,
  }: {
    token: string;
    playlistHref: string;
    tracks: Array<SpotifyApi.PlaylistTrackObject>;
  }): Promise<void> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const data = {
      tracks: tracks.map(track => ({ uri: track.track.linked_from?.uri || track.track.uri })),
    };

    await firstValueFrom(
      this.httpService.delete<SpotifyApi.RemoveTracksFromPlaylistResponse>(
        `${playlistHref}/tracks`,
        {
          data,
          headers,
          timeout: 50000,
        },
      ),
    );
  }

  async saveUnclassified(token: string) {
    const savedTracks = await this.getPlaylistTracks({ token, playlistHref: '/me/tracks' });

    const playlists = await this.getUserPlaylists(token);
    const playlistTracks = ([] as Array<SpotifyApi.PlaylistTrackObject>).concat(
      ...(await Promise.all(
        playlists.map(playlist =>
          this.getPlaylistTracks({ token, playlistHref: playlist.tracks.href }),
        ),
      )),
    );

    const unclassifiedPlaylist =
      playlists.find(p => p.name === UNCLASSIFIED_PLAYLIST_NAME) ||
      (await this.createPlaylist({ token, name: UNCLASSIFIED_PLAYLIST_NAME }));
    const unclassifiedTracks = savedTracks.filter(
      savedTrack =>
        !playlistTracks.find(playlistTrack => playlistTrack.track.uri === savedTrack.track.uri),
    );

    await this.emptyPlaylist({ token, playlistHref: unclassifiedPlaylist.href });

    await this.addTracksToPlaylist({
      token,
      playlistHref: unclassifiedPlaylist.href,
      tracks: unclassifiedTracks,
    });
  }
}
