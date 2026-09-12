import { Module } from '@nestjs/common';
import { PinsController } from './pins.controller.js';
import { PinsService } from './pins.service.js';
import { PrismaService } from '../prisma.service.js';

@Module({
  controllers: [PinsController],
  providers: [PinsService, PrismaService]
})
export class PinsModule {}
