import { Module } from "@nestjs/common";
import { RegisterService } from "./services/register.service";
import { TelegrafModule } from "nestjs-telegraf";
import { PrismaService } from "../prisma/prisma.service";
import { UserService } from "./services/user.service";

@Module({
    imports: [
        TelegrafModule.forRoot({
            token : '8136625937:AAE1NVab4ZriLEYwKmqy3jsw5Q3un6WqvhQ'
        })
    ],
    providers: [RegisterService,PrismaService,UserService],
})

export class TgBootModule {}