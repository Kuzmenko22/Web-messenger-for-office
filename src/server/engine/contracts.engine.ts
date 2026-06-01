// import { db } from "src/server/db"
// import { TaskType, TaskStatus } from "@prisma/client"
// import { addMonths } from "date-fns"

// type CreateContractInput = {
//   clientId: string
//   managerId: string
//   number: string
//   startDate: Date
//   endDate: Date
//   amount: number
//   description?: string
// }

// type RenewContractInput = {
//   contractId: string
//   months: number
// }

// type CancelContractInput = {
//   contractId: string
// }

// export const ContractsEngine = {

//   // ================= CREATE =================
//   async createContract(data: CreateContractInput) {
//     const contract = await db.contract.create({
//       data: {
//         number: data.number,
//         clientId: data.clientId,
//         managerId: data.managerId,
//         startDate: data.startDate,
//         endDate: data.endDate,
//         amount: data.amount,
//         description: data.description,
//       },
//     })

//     await db.task.create({
//       data: {
//         title: `Заключение договора №${data.number}`,
//         description: "Автоматическая задача системы CRM",
//         dueDate: data.startDate,
//         taskType: TaskType.CONTRACT,
//         status: TaskStatus.PENDING,
//         assignedToId: data.managerId,
//         createdById: data.managerId,
//         clientId: data.clientId,
//         contractId: contract.id,
//       },
//     })

//     return contract
//   },

//   // ================= RENEW =================
//   async renewContract(data: RenewContractInput) {
//     const contract = await db.contract.findUnique({
//       where: { id: data.contractId },
//     })

//     if (!contract) throw new Error("Contract not found")

//     const newEndDate = addMonths(contract.endDate, data.months)

//     const updated = await db.contract.update({
//       where: { id: data.contractId },
//       data: {
//         endDate: newEndDate,
//       },
//     })

//     await db.task.create({
//       data: {
//         title: `Продление договора №${contract.number}`,
//         description: `Продление на ${data.months} мес.`,
//         dueDate: new Date(),
//         taskType: TaskType.RENEWAL,
//         status: TaskStatus.PENDING,
//         assignedToId: contract.managerId,
//         createdById: contract.managerId,
//         clientId: contract.clientId,
//         contractId: contract.id,
//       },
//     })

//     return updated
//   },

//   // ================= CANCEL =================
//   async cancelContract(data: CancelContractInput) {
//     const contract = await db.contract.findUnique({
//       where: { id: data.contractId },
//     })

//     if (!contract) throw new Error("Contract not found")

//     // создаём задачу расторжения
//     await db.task.create({
//       data: {
//         title: `Расторжение договора №${contract.number}`,
//         description: "Инициировано расторжение договора",
//         dueDate: new Date(),
//         taskType: TaskType.CANCEL,
//         status: TaskStatus.PENDING,
//         assignedToId: contract.managerId,
//         createdById: contract.managerId,
//         clientId: contract.clientId,
//         contractId: contract.id,
//       },
//     })

//     // можно позже добавить статус contract.status = CLOSED

//     return contract
//   },
// }