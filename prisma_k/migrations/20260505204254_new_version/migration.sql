-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "amount" INTEGER,
ADD COLUMN     "durationMonths" INTEGER;

-- CreateIndex
CREATE INDEX "Task_clientId_idx" ON "Task"("clientId");

-- CreateIndex
CREATE INDEX "Task_contractId_idx" ON "Task"("contractId");
