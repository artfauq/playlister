import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginCallbackQueryDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/login')
  login(@Res() res: Response) {
    // TODO: handle state
    const authorizeUrl = this.authService.getAuthorizeUrl();

    res.redirect(authorizeUrl);
  }

  @Get('/callback')
  async loginCallback(@Query() query: LoginCallbackQueryDto) {
    // TODO: handle state
    const token = await this.authService.getAccessToken(query.code);

    return { token };
  }

  @Post('/refresh-token')
  async refreshToken(@Body() body: RefreshTokenDto) {
    const token = await this.authService.refreshToken(body.refreshToken);

    return token;
  }
}
