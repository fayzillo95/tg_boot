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

export const userEntity = { first_name: true, last_name: true, phone_number: true ,birth_date : true}

export const homeEntity = {
    reply_markup: {
        keyboard: [
            [{ text: "Profile" }],
            [{ text: "Edit" }],
            [{text : "Delete"}],
            [{text : "Clear"}]
        ],
        resize_keyboard: true,
        one_time_keyboard: true,
    }
}

export const homeMenu = [
    { command: "info", description: "Get information" },
    { command: "help", description: "Show help" },
    { command: "menu", description: "Exit to menu" }
]

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

export const getDateString = (newDate : Date | undefined = new Date()): string => {
    const months = [
        "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
        "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
    ];
    const day = newDate.getDate().toString().padStart(2, '0');
    const month = months[newDate.getMonth()];
    const year = newDate.getFullYear();
    return `${day} ${month} ${year}`;
}

export const response = (data: User) => {
  const sana = getDateString(data.birth_date ?? undefined);  
  return `
📋 FOYDALANUVCHI MA'LUMOTLARI

👤 Ism: ${data.first_name || "-"}
👤 Familiya: ${data.last_name || "-"}
📞 Telefon: ${data.phone_number || "-"}
🎂 Tug'ilgan sana: ${sana}
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

// export const getMsgIds = (n : number) => {

// }

// export const clearChat = (ctx : Context) => {
//     let end = 0
//     // @ts-ignore
//     for(let i = 1; i < ctx.message?.message_id; i ++){
//         try {
//             ctx.telegram.deleteMessage(ctx.from?.id || 7463402937,i)
//         } catch (error) {
//             console.log(i)
//         }
//         end = i
//     }
//     ctx.reply("Xabarlar tozalandi")
//     setTimeout(() => {
//         try {
//             ctx.telegram.deleteMessage(ctx.from?.id || 7463402937,end)
//         } catch (error) {
//             console.log(end)
//         }
//     })
// }