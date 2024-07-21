/*
  Warnings:

  - Added the required column `cardNumber` to the `Commande` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Commande" ADD COLUMN     "cardNumber" TEXT NOT NULL;
