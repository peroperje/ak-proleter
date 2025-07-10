/*
  Warnings:

  - You are about to drop the column `userId` on the `Result` table. All the data in the column will be lost.
  - Added the required column `athleteId` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Result" DROP CONSTRAINT "Result_userId_fkey";

-- AlterTable
ALTER TABLE "Result" DROP COLUMN "userId",
ADD COLUMN     "athleteId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
