import { User } from "@prisma/client"
import { UserService } from "./user.service"
import { Context } from "telegraf"


export const sendContactEntity = {
    reply_markup: {
        keyboard: [
            [{ text: "Contacni yuborish", request_contact: true }]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
    }
}

export const userEntity = { first_name: true, last_name: true, phone_number: true }

export const homeEntity = {
    reply_markup: {
        keyboard: [
            [{ text: "Profile" }],
            [{ text: "Edit" }],
            [{text : "Delete"}]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
    }
}

export const searchbyIdEntity = (user_id: number) => {
    return {
        where: { user_id: user_id }
    }
}
export const editMessage = "Menyuda taxrirlamoqchi bo'lgan ustuningizni tanlang"
export const getEditButtons = {
    reply_markup: {
        keyboard: [
            [{ text: "1 Ismni taxrirlash " }],
            [{ text: "2 Familiyani taxrirlash" }],
            [{ text: "3 Tug'ilgan kunni taxrirlash !" }],
            [{ text: "4 Home" }]
        ]
    }
}
export const targetsEdit = ["1 Ismni taxrirlash", "2 Familiyani taxrirlash", "3 Tug'ilgan kunni taxrirlash !", "4 Home"]

export const response = (data: User) => {
  return `
📋 FOYDALANUVCHI MA'LUMOTLARI

👤 Ism: ${data.first_name || "-"}
👤 Familiya: ${data.last_name || "-"}
📞 Telefon: ${data.phone_number || "-"}
🎂 Tug'ilgan sana: ${data.birth_date ? data.birth_date.toISOString().split('T')[0] : "-"}
  `;
};


const userStep = new Map([
    [1, 'first_name'],
    [2, "last_name"],
    [3, "birth_date"]
])

export const updateTarget = (ctx: Context, data: string, step: number) => {
    const result: { [key: string]: any } = {};
    const key = userStep.get(step);
    if (!key) return result;

    if (key === 'birth_date') {
        const isValid = /^\d{2}-\d{2}-\d{4}$/.test(data);

        if (!isValid) {
            ctx.reply("Iltimos, tug'ilgan kunni shu formatda kiriting: `dd-mm-yyyy`");
            return "invalid";
        }

        const [day, month, year] = data.split("-").map(Number);
        result[key] = new Date(year, month - 1, day);
    }
    else {
        result[key] = data;
    }

    return result;
};
