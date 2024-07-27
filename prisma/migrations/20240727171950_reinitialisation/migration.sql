-- CreateTable
CREATE TABLE "Societe" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "typeJuridique" TEXT,
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

    CONSTRAINT "Societe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "companyId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cgu" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "titre" TEXT NOT NULL,
    "libelle" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Cgu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Client" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "matricule" TEXT NOT NULL,
    "fullname" TEXT NOT NULL,
    "companyName" TEXT,
    "adressPostal" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "iban" TEXT,
    "tva" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Commande" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "code" TEXT NOT NULL,
    "taxe" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "servicePrice" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "payementMethod" TEXT,
    "cardNumber" TEXT NOT NULL,
    "ownerName" TEXT NOT NULL,
    "beginDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "horsTaxe" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "time" DOUBLE PRECISION,
    "taxeService" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "TTC" DOUBLE PRECISION DEFAULT 0.0,
    "conditionId" INTEGER NOT NULL,
    "clientId" INTEGER NOT NULL,
    "societeId" INTEGER NOT NULL,

    CONSTRAINT "Commande_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Prelevement" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "method" TEXT,

    CONSTRAINT "Prelevement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrelevementOnCommandes" (
    "commandeId" INTEGER NOT NULL,
    "prelevementId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PrelevementOnCommandes_pkey" PRIMARY KEY ("commandeId","prelevementId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_matricule_key" ON "Client"("matricule");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "Cgu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Commande" ADD CONSTRAINT "Commande_societeId_fkey" FOREIGN KEY ("societeId") REFERENCES "Societe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Articles" ADD CONSTRAINT "Articles_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrelevementOnCommandes" ADD CONSTRAINT "PrelevementOnCommandes_commandeId_fkey" FOREIGN KEY ("commandeId") REFERENCES "Commande"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrelevementOnCommandes" ADD CONSTRAINT "PrelevementOnCommandes_prelevementId_fkey" FOREIGN KEY ("prelevementId") REFERENCES "Prelevement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
