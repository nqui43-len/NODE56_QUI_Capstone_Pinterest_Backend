import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { PinsModule } from './pins/pins.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    UsersModule,
    PinsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}