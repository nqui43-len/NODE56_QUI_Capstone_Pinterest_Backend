import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { PinsModule } from './pins/pins.module.js';
import { CommentsModule } from './comments/comments.module.js';
import { AuthModule } from './auth/auth.module.js';

// Tạm thời comment dòng này
// import { createObserveModule } from '@nestjs/observe';
// export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    /* Tạm thời vô hiệu hóa tính năng gửi Telemetry
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'pinterest-backend',
    }),
    */
    UsersModule,
    PinsModule,
    CommentsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}