import { Controller, Get, Param, ParseIntPipe, Post, Delete, Patch, UseGuards, UseInterceptors, UploadedFile, Body, Req, Query } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PinsService } from './pins.service.js';
import { AuthGuard } from '../auth/auth.guard.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pinterest_clone',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  } as any,
});

@Controller('pins')
export class PinsController {
  constructor(private readonly pinsService: PinsService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: cloudStorage }))
  async uploadPin(@UploadedFile() file: Express.Multer.File, @Body() body: any, @Req() req: any) {
    
    const imageUrl = file.path; 

    return this.pinsService.create(req.user.userId, imageUrl, body);
  }

  @Get()
  async findAll(@Query('search') search?: string) {
    return this.pinsService.findAll(search);
  }

  @Get('user/:userId')
  async findByUser(@Param('userId', ParseIntPipe) userId: number) {
    return this.pinsService.findByUser(userId);
  }

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

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updatePin(
    @Param('id', ParseIntPipe) id: number, 
    @Body() body: any, 
    @Req() req: any
  ) {
    return this.pinsService.update(id, req.user.userId, body);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deletePin(
    @Param('id', ParseIntPipe) id: number, 
    @Req() req: any
  ) {
    return this.pinsService.remove(id, req.user.userId);
  }
}