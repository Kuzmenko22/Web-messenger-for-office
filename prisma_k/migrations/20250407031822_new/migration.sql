/*
  Warnings:

  - You are about to drop the column `groupId` on the `Lesson` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Lesson" DROP CONSTRAINT "Lesson_subgroupId_fkey";

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "groupId",
ALTER COLUMN "subgroupId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "_GroupLessons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_GroupLessons_AB_unique" ON "_GroupLessons"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupLessons_B_index" ON "_GroupLessons"("B");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_subgroupId_fkey" FOREIGN KEY ("subgroupId") REFERENCES "Subgroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupLessons" ADD CONSTRAINT "_GroupLessons_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupLessons" ADD CONSTRAINT "_GroupLessons_B_fkey" FOREIGN KEY ("B") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
