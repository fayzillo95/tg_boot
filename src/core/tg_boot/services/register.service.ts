import { Ctx, On, Start, Update } from "nestjs-telegraf";
import { PrismaService } from "src/core/prisma/prisma.service";
import { Context } from "telegraf";
import { UserService } from "./user.service";
import { editMessage, getEditButtons, homeEntity, response, sendContactEntity, targetsEdit, updateTarget } from "./entitiys";

@Update()
export class RegisterService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService
  ) { }

  @Start()
  async start(@Ctx() ctx: Context) {
    ctx.reply(`Contactingizni yuboring`, sendContactEntity)
  }

  @On("contact")
  async getContact(@Ctx() ctx: Context) {

    await this.userService.createUser(ctx)
  }

  @On("text")
  async home(@Ctx() ctx: Context) {
    const text = ctx.message?.['text'].trim()
    const id = ctx.from?.id
    const step = await this.userService.getStep(id)
    if (!text || text.length === 0) {
      return
    }
    if (text.startsWith("Profi")) {
      await this.sendProfile(ctx)
      return
    }
    if (text.startsWith("Edi")) {
      if (!(await this.userService.findByUserId(id))) {
        ctx.reply("Ro'yxatdan o'tmagan foydalnuvchi !", sendContactEntity)
        return
      }
      ctx.reply(editMessage, getEditButtons)
      return
    }
    if(text === 'Delete'){
      await this.userService.delete(id)
      ctx.reply("/start",sendContactEntity)
      return
    }
    if (text.startsWith("4 Home")) {
      if (!(await this.userService.findByUserId(id))) {
        ctx.reply("Ro'yxatdan o'tmagan foydalnuvchi !", sendContactEntity)
        return
      }
      ctx.reply("Menyudan tanlang !", homeEntity)
    } else {
      if (targetsEdit.includes(text)) this.editProfile(ctx, text, id)
      if (step === 0) return
      await this.updateItem(ctx, text, id)
      this.sendProfile(ctx)
      return
    }
  }

  async sendProfile(ctx: Context) {
    const id = ctx.message?.from.id
    // @ts-ignore
    const data = await this.userService.findByUserId(id)
    if (!data) {
      ctx.reply("Ma'lumotlar  topilmadi", sendContactEntity)
      return
    }
    ctx.reply(response(data))
  }

  async editProfile(ctx: Context, text: string, id: number | undefined) {
    const user = (await this.userService.findByUserId(id))
    if (!user) {
      ctx.reply("Ro'yxatdan o'tmagan foydalnuvchi !", sendContactEntity)
      return
    }
    if (text.startsWith("1 Ism")) {
      this.editStep(ctx, 1)
      ctx.reply("Ismingizni kiriting !", homeEntity)
    }
    if (text.startsWith("2 Fam")) {
      await this.editStep(ctx, 2)
      ctx.reply("Familiyangizni kiriting !", homeEntity)
    }
    if (text.startsWith("3 Tug")) {
      await this.editStep(ctx, 3)
      ctx.reply("Tug'gilgan sanangizni kiriting !", homeEntity)
    }
  }

  async editStep(ctx: Context, step: number) {
    const id = ctx.message?.from.id
    // @ts-ignore
    const result = await this.userService.updateUser(id, { step })
    if (!result) {
      return
    }
  }

  async updateItem(ctx: Context, text: string, id: number | undefined) {
    const user = (await this.userService.findByUserId(id))
    console.log(user)
    if (!user) {
      ctx.reply("Ro'yxatdan o'tmagan foydalnuvchi !", sendContactEntity)
      return
    }
    // @ts-ignore1
    const step = await this.userService.getStep(id)
    // @ts-ignore
    const data = updateTarget(ctx, text, step)
    if (data === "invalid") return
    console.log(data)
    // @ts-ignore
    await this.userService.updateUser(id, data)
    this.editStep(ctx, 0)

  }

}