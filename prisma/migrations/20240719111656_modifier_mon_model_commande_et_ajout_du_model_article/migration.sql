/*
  Warnings:

  - You are about to drop the column `details` on the `Commande` table. All the data in the column will be lost.
  - You are about to drop the column `product` on the `Commande` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Commande` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Commande` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Commande" DROP COLUMN "details",
DROP COLUMN "product",
DROP COLUMN "quantity",
DROP COLUMN "unitPrice";

-- CreateTable
CREATE TABLE "Articles" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "libelle" TEXT NOT NULL,
    "details" TEXT,
    "unitPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "commandeId" INTEGER NOT NULL,

    CONSTRAINT "Articles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
