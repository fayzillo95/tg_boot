# Node.js image
FROM node:20-alpine

# App papkasi
WORKDIR /app

# Package fayllar
COPY package*.json ./

# Paketlar o‘rnatish
RUN npm install

# Qolgan fayllar
COPY . .

# Prisma generate

# RUN npx prisma migrate reset --force
# yoki xavfsizroq variant:
RUN npx prisma generate
RUN npx prisma db push --accept-data-loss


# Port (ixtiyoriy, agar HTTP server ishlatilsa)
EXPOSE 15975

# Botni ishga tushurish
CMD ["npm", "run", "start:dev"]
