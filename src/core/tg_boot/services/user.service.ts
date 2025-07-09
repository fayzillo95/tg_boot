import { User } from "@prisma/client";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Context } from "telegraf";
import { homeEntity, response, searchbyIdEntity, userEntity } from "./entitiys";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
    ) {

    }
    async createUser(ctx: Context) {
        if (ctx.message && ctx.message.from) {
            const user = ctx.message?.['contact']
            if((await this.checkExists(user.user_id,ctx))){
                return 
            }

            const result = await this.prisma.user.create({
                data: {...user},
                select: userEntity
            })
            ctx.reply(response(user),homeEntity)
        }
    }
    async profileHandler(ctx: Context, user: User) {
        ctx.reply("Siz oldin ro'yxattadan o'tgansiz", homeEntity)
    }
    
    async checkExists(user_id: number, ctx: Context) {
        const user = await this.prisma.user.findFirst(searchbyIdEntity(user_id));

        if (user) {
            this.profileHandler(ctx, user)
            return user
        }
        return null
    }

    async updateUser(user_id : number,data : Partial<User>){
        if(!(await this.prisma.user.findFirst({where : {user_id : user_id}}))){
            return false
        }
        const user = await this.prisma.user.update({
            where : {user_id : user_id},
            data,
            select : userEntity
        })
        return user
    }
    async getStep(user_id : number | undefined){
        const result = await this.prisma.user.findFirst({where : {user_id : user_id}})
        return result?.step
    }
    async findByUserId(id : number | undefined){
        const user = await this.prisma.user.findFirst({
            where : {user_id : id}
        })
        return user
    }
    async delete(id : number | undefined){
        if(!(await this.prisma.user.findFirst({where : {user_id : id}}))){
            return "Ma'lumot topilmadi !"
        }
        const result = await this.prisma.user.delete({where : {user_id : id}})
        return result
    }
}