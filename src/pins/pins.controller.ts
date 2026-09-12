// pinterest-backend/src/pins/pins.controller.ts
import { Controller, Get, Param, ParseIntPipe, Post, Delete, Patch, UseGuards, UseInterceptors, UploadedFile, Body, Req, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PinsService } from './pins.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

@Controller('pins')
export class PinsController {
  constructor(private readonly pinsService: PinsService) {}

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

  // API Upload (Giữ nguyên code cũ của bạn)
  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
  }))
  async uploadPin(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Req() req: any) {
    const imageUrl = `http://localhost:3001/uploads/${file.filename}`;
    return this.pinsService.create(req.user.userId, imageUrl, body);
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