/*
  Warnings:

  - You are about to drop the column `priority` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Task` table. All the data in the column will be lost.
  - Added the required column `durationMonths` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskType` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('CONTRACT', 'RENEWAL', 'CANCEL');

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "priority",
DROP COLUMN "status",
ADD COLUMN     "durationMonths" INTEGER NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "taskType" "TaskType" NOT NULL;

-- DropEnum
DROP TYPE "StatusTask";
