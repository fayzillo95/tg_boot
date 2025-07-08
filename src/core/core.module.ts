import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { TgBootModule } from './tg_boot/tg_boot.module';

@Module({
  imports: [TgBootModule, PrismaModule]
})
export class CoreModule {}
