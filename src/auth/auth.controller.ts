import { Controller, Patch, Post, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthGuard } from './auth.guard.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(@Req() req: any, @Body() body: { username: string; avatarUrl?: string }) {
    return this.authService.updateProfile(req.user.userId, body);
  }

  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
}