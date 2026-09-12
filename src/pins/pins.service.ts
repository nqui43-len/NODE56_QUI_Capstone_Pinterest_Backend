// pinterest-backend/src/pins/pins.service.ts
import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service.js';

@Injectable()
export class PinsService {
  constructor(private prisma: PrismaService) {}

  // READ & SEARCH: Lấy danh sách kết hợp tìm kiếm theo tiêu đề/mô tả
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

  // CREATE (Giữ nguyên logic cũ của bạn)
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

  // READ: Lấy chi tiết 1 ảnh (Giữ nguyên logic cũ)
  async findOne(id: number) {
    return this.prisma.pin.findUnique({
      where: { id },
      include: { author: { select: { username: true, avatarUrl: true } } },
    });
  }

  // UPDATE: Cập nhật thông tin ảnh
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

  // DELETE: Xóa ảnh
  async remove(pinId: number, userId: number) {
    const pin = await this.prisma.pin.findUnique({ where: { id: pinId } });
    if (!pin) throw new NotFoundException('Không tìm thấy hình ảnh');
    if (pin.authorId !== userId)
      throw new ForbiddenException('Bạn không có quyền xóa ảnh này');

    return this.prisma.pin.delete({ where: { id: pinId } });
  }

  // Lấy danh sách ảnh do một user cụ thể tạo ra
  async findByUser(userId: number) {
    return this.prisma.pin.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        author: { select: { username: true, avatarUrl: true } },
      },
    });
  }

  // Lưu hoặc bỏ lưu ảnh (Toggle)
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

  // Lấy danh sách ảnh đã lưu của người dùng
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
    // Bóc tách để trả về đúng mảng PinData cho Frontend
    return savedPins.map((sp: any) => sp.pin);
  }
}
