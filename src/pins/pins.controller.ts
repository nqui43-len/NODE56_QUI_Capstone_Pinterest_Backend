// pinterest-backend/src/pins/pins.controller.ts
import { Controller, Get, Param, ParseIntPipe, Post, Delete, Patch, UseGuards, UseInterceptors, UploadedFile, Body, Req, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PinsService } from './pins.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

// 1. Cấu hình xác thực Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Khởi tạo bộ lưu trữ Cloud
const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pinterest_clone', // Tên thư mục sẽ tạo trên Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

@Controller('pins')
export class PinsController {
  constructor(private readonly pinsService: PinsService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  // 3. Đổi cấu hình lưu trữ tại Interceptor
  @UseInterceptors(FileInterceptor('file', { storage: cloudStorage }))
  async uploadPin(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Req() req: any) {
    
    // file.path bây giờ sẽ KHÔNG phải là đường dẫn cục bộ nữa
    // Nó chứa trực tiếp link HTTPS xịn từ Cloudinary (VD: https://res.cloudinary.com/...)
    const imageUrl = file.path; 

    // Kiểm tra xem backend của bạn trước đây có gán cứng 'http://localhost:3001/' không.
    // Nếu có, hãy xóa đi và chỉ lưu trực tiếp imageUrl vào database.
    return this.pinsService.create(req.user.userId, imageUrl, body);
  }

  // Nhận thêm query ?search= từ Frontend
  @Get()
  async findAll(@Query('search') search?: string) {
    return this.pinsService.findAll(search);
  }

  // Thêm API endpoint mới này
  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.pinsService.findByUser(userId);
  }

  // Đặt HÀM NÀY NẰM TRÊN @Get(':id')
  @UseGuards(AuthGuard)
  @Get('saved/list')
  async getSavedPins(@Req() req: any) {
    return this.pinsService.getSavedPins(req.user.userId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/save')
  async toggleSavePin(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
    return this.pinsService.toggleSavePin(req.user.userId, id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pinsService.findOne(id);
  }

  // API Cập nhật
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updatePin(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: any, 
    @Req() req: any
  ) {
    return this.pinsService.update(id, req.user.userId, body);
  }

  // API Xóa
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePin(
    @Param('id', ParseIntPipe) id: number, 
    @Req() req: any
  ) {
    return this.pinsService.remove(id, req.user.userId);
  }
}