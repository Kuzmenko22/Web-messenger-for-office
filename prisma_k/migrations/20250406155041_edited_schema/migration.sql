/*
  Warnings:

  - You are about to drop the column `date` on the `Lesson` table. All the data in the column will be lost.
  - Added the required column `dayOfWeek` to the `Lesson` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Lesson` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('LECTURE', 'LAB', 'KSR');

-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY');

-- AlterTable
ALTER TABLE "Lesson" DROP COLUMN "date",
ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL,
ADD COLUMN     "type" "LessonType" NOT NULL;
