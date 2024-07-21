/*
  Warnings:

  - A unique constraint covering the columns `[matricule]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Client_matricule_key" ON "Client"("matricule");
