// pinterest-backend/src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(body: any) {
    const { email, password, username } = body;

    // 1. Kiểm tra trùng lặp email
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Email này đã được sử dụng');
    }

    // 2. Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Tạo user mới
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        username,
        avatarUrl: `https://ui-avatars.com/api/?name=${username}&background=random`,
        jobTitle: 'Người dùng', // Giá trị mặc định
      },
    });

    return { message: 'Đăng ký thành công', userId: newUser.id };
  }

  async login(body: any) {
    const { email, password } = body;

    // 1. Tìm user theo email
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 2. Kiểm tra mật khẩu
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email hoặc mật khẩu không chính xác');
    }

    // 3. Ký JWT Token
    const payload = { userId: user.id, email: user.email };
    return {
      message: 'Đăng nhập thành công',
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
      }
    };
  }

  async updateProfile(userId: number, data: { username: string; avatarUrl?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        avatarUrl: data.avatarUrl,
      },
      select: { id: true, email: true, username: true, avatarUrl: true }
    });
  }
}