import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class PinsService {
  constructor(private prisma: PrismaService) {}

  async findAll(searchTerm?: string) {
    return this.prisma.pin.findMany({
      where: searchTerm
        ? {
            OR: [
              { title: { contains: searchTerm, mode: 'insensitive' } },
              { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
          }
        : {},
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { username: true, avatarUrl: true } },
      },
    });
  }

  async create(userId: number, imageUrl: string, body: any) {
    return this.prisma.pin.create({
      data: {
        title: body.title,
        description: body.description || '',
        imageUrl: imageUrl,
        authorId: userId,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.pin.findUnique({
      where: { id },
      include: { author: { select: { username: true, avatarUrl: true } } },
    });
  }

  async update(pinId: number, userId: number, data: any) {
    const pin = await this.prisma.pin.findUnique({ where: { id: pinId } });
    if (!pin) throw new NotFoundException('Không tìm thấy hình ảnh');
    if (pin.authorId !== userId)
      throw new ForbiddenException('Bạn không có quyền sửa ảnh này');

    return this.prisma.pin.update({
      where: { id: pinId },
      data: {
        title: data.title,
        description: data.description,
      },
    });
  }

  async remove(pinId: number, userId: number) {
    const pin = await this.prisma.pin.findUnique({ where: { id: pinId } });
    if (!pin) throw new NotFoundException('Không tìm thấy hình ảnh');
    if (pin.authorId !== userId)
      throw new ForbiddenException('Bạn không có quyền xóa ảnh này');

    return this.prisma.pin.delete({ where: { id: pinId } });
  }

  async findByUser(userId: number) {
    return this.prisma.pin.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { username: true, avatarUrl: true } },
      },
    });
  }

  async toggleSavePin(userId: number, pinId: number) {
    const pin = await this.prisma.pin.findUnique({ where: { id: pinId } });
    if (!pin) throw new NotFoundException('Không tìm thấy hình ảnh');

    const existingSave = await this.prisma.savedPin.findUnique({
      where: { userId_pinId: { userId, pinId } },
    });

    if (existingSave) {
      await this.prisma.savedPin.delete({
        where: { userId_pinId: { userId, pinId } },
      });
      return { message: 'Đã bỏ lưu ảnh', isSaved: false };
    } else {
      await this.prisma.savedPin.create({
        data: { userId, pinId },
      });
      return { message: 'Đã lưu vào hồ sơ', isSaved: true };
    }
  }

  async getSavedPins(userId: number) {
    const savedPins = await this.prisma.savedPin.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        pin: {
          include: { author: { select: { username: true, avatarUrl: true } } },
        },
      },
    });
    return savedPins.map((sp: any) => sp.pin);
  }
}
