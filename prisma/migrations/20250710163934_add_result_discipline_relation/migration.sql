/*
  Warnings:

  - Added the required column `disciplineId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UnitType" AS ENUM ('TIME', 'DISTANCE', 'POINTS', 'COUNT', 'WEIGHT', 'OTHER');

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "disciplineId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "DisciplineCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DisciplineCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MeasurementUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "type" "UnitType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MeasurementUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Discipline" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "internationalSign" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT,
    "unitId" TEXT,
    "isTrackEvent" BOOLEAN NOT NULL DEFAULT false,
    "isFieldEvent" BOOLEAN NOT NULL DEFAULT false,
    "isRoadEvent" BOOLEAN NOT NULL DEFAULT false,
    "isCombinedEvent" BOOLEAN NOT NULL DEFAULT false,
    "isTeamEvent" BOOLEAN NOT NULL DEFAULT false,
    "olympicEvent" BOOLEAN NOT NULL DEFAULT false,
    "paralympicEvent" BOOLEAN NOT NULL DEFAULT false,
    "worldChampionshipEvent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discipline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DisciplineCategory_name_key" ON "DisciplineCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementUnit_name_key" ON "MeasurementUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MeasurementUnit_symbol_key" ON "MeasurementUnit"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Discipline_name_key" ON "Discipline"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Discipline_internationalSign_key" ON "Discipline"("internationalSign");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "Discipline"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "DisciplineCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discipline" ADD CONSTRAINT "Discipline_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "MeasurementUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;
