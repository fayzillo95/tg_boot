import { Injectable, OnModuleDestroy, OnModuleInit, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('PrismaClient connected');
        } catch (error) {
            this.logger.error('PrismaClient initialization failed', error.stack);
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        try {
            await this.$disconnect();
            this.logger.log('PrismaClient disconnected');
        } catch (error) {
            this.logger.error('Error during PrismaClient disconnect', error.stack);
            process.exit(1);
        }
    }
}