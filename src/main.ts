// pinterest-backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception.filter.js';
import { join } from 'path'; // Đã sửa lại thành import chuẩn của NodeJS

async function bootstrap() {
  // Thêm <NestExpressApplication> để NestJS biết bạn đang dùng lõi Express
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Giữ lại cấu hình CORS chi tiết của bạn (đã xóa dòng gọi trùng lặp)
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Giữ nguyên các cấu hình bảo mật và xử lý lỗi của bạn
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Cấu hình public thư mục ảnh bằng hàm chuẩn của NestJS
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  await app.listen(3001);
}
bootstrap();