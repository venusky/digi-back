-- CreateTable
CREATE TABLE "societe" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "adress" TEXT,
    "email" TEXT,
    "website" TEXT,
    "phone" TEXT,
    "NAF" TEXT,
    "capital" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "country" TEXT,
    "city" TEXT,
    "taxeImma" TEXT,
    "manager" TEXT,
    "managerPhone" TEXT,

    CONSTRAINT "societe_pkey" PRIMARY KEY ("id")
);
