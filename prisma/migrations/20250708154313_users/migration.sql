-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "step" INTEGER NOT NULL DEFAULT 1,
    "user_id" BIGINT NOT NULL,
    "first_name" TEXT DEFAULT '',
    "last_name" TEXT DEFAULT '',
    "age" INTEGER DEFAULT 1,
    "phone_number" TEXT DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "birth_date" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_user_id_key" ON "users"("user_id");
