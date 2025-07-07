/*
  Warnings:

  - You are about to drop the column `categoryId` on the `Event` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_categoryId_fkey";

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "categoryId";

-- AlterTable
ALTER TABLE "_participants" ADD CONSTRAINT "_participants_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_participants_AB_unique";

-- CreateTable
CREATE TABLE "_EventToCategory" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EventToCategory_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_EventToCategory_B_index" ON "_EventToCategory"("B");

-- AddForeignKey
ALTER TABLE "_EventToCategory" ADD CONSTRAINT "_EventToCategory_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EventToCategory" ADD CONSTRAINT "_EventToCategory_B_fkey" FOREIGN KEY ("B") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
