/*
  Warnings:

  - Added the required column `titre` to the `Cgu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cgu" ADD COLUMN     "titre" TEXT NOT NULL;
