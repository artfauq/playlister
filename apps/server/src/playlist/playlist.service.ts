import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlaylistService {
  constructor(private httpService: HttpService) {}

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

    const playlistTracks = await this.getPlaylistTracks(token, toCleanPlaylist.tracks.href);
    console.log(`\nFound ${playlistTracks.length} songs in playlist ${toCleanPlaylist.name}`);

    const searchTracks = ([] as Array<SpotifyApi.PlaylistTrackObject>).concat(
      ...(await Promise.all(
        searchPlaylists.map(playlist => this.getPlaylistTracks(token, playlist.tracks.href)),
      )),
    );
    console.log(
      `\nFound ${searchTracks.length} songs in playlists: ${searchPlaylists
        .map(playlist => playlist.name)
        .join(', ')}`,
    );
    const toDeleteTracks = playlistTracks
      .filter(
        ({ track: t1 }) =>
          !t1.is_local &&
          searchTracks.find(
            ({ track: t2 }) =>
              t1.uri === t2.uri ||
              (t1.name.toLowerCase() === t2.name.toLowerCase() &&
                t1.artists.map(artist => artist.name).join(',') ===
                  t2.artists.map(artist => artist.name).join(',')),
          ),
      )
      .map(({ track }) => track);

    if (toDeleteTracks.length === 0) {
      return;
    }

    // Remove tracks by chunks of 100
    await Promise.all(
      Array(Math.ceil(toDeleteTracks.length / 100))
        .fill(null)
        .map((_, index) => index * 100)
        .map(begin => toDeleteTracks.slice(begin, begin + 100))
        .map(chunk => this.removePlaylistTracks(token, toCleanPlaylist.id, chunk)),
    );

    console.log(`\nSuccessfully removed ${toDeleteTracks.length} songs:`);

    toDeleteTracks.forEach(track => {
      console.log(`- ${track.artists.map(artist => artist.name).join(' + ')} - ${track.name}`);
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
  async getPlaylistTracks(
    token: string,
    href: string,
    acc: Array<SpotifyApi.PlaylistTrackObject> = [],
  ): Promise<Array<SpotifyApi.PlaylistTrackObject>> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const { data } = await firstValueFrom(
      this.httpService.get<SpotifyApi.PlaylistTrackResponse>(href, {
        params: { limit: 100 },
        headers,
      }),
    );

    // Retrieve tracks from response and sort them by name
    const tracks = [...acc, ...data.items].sort(({ track: trackA }, { track: trackB }) =>
      trackA.name.localeCompare(trackB.name),
    );

    return data.next ? this.getPlaylistTracks(token, data.next, tracks) : tracks;
  }

  /**
   * Returns all the tracks of a playlist.
   */
  async removePlaylistTracks(
    token: string,
    playlistId: string,
    tracks: Array<SpotifyApi.TrackObjectFull> = [],
  ): Promise<void> {
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const data = {
      tracks: tracks.map(track => ({ uri: track.linked_from?.uri || track.uri })),
    };

    await firstValueFrom(
      this.httpService.delete<SpotifyApi.RemoveTracksFromPlaylistResponse>(
        `/playlists/${playlistId}/tracks`,
        { data, headers, timeout: 50000 },
      ),
    );
  }
}
