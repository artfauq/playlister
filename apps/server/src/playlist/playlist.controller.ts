import { Controller, Get, Param, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { CleanPlaylistQueryDto } from './dto/clean-playlist.dto';
import { PlaylistService } from './playlist.service';

@Controller('playlists')
export class PlaylistController {
  constructor(private playlistService: PlaylistService) {}

  @Get('/')
  async getPlaylists(@Req() req: Request) {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.playlistService.getUserPlaylists(token);
  }

  @Post('/:playlistName/clean')
  async cleanPlaylist(
    @Req() req: Request,
    @Param('playlistName') playlistName: string,
    @Query() query: CleanPlaylistQueryDto,
  ): Promise<void> {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new UnauthorizedException();
    }

    return this.playlistService.cleanPlaylist(token, playlistName, query.playlistNames);
  }
}
