import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc'

import { db } from 'src/server/db'

export const financesRouter =
  createTRPCRouter({

    calculateSalary:
      protectedProcedure

        .input(
          z.object({
            userId: z.string(),

            year: z.number(),

            month: z.number(),
          })
        )

        .query(async ({ input }) => {

          const startDate =
            new Date(
              input.year,
              input.month - 1,
              1
            )

          const endDate =
            new Date(
              input.year,
              input.month,
              0,
              23,
              59,
              59
            )

          const user =
            await db.user.findUnique({
              where: {
                id: input.userId,
              },
            })

          if (!user) {
            throw new Error(
              'Пользователь не найден'
            )
          }

          const tasks =
            await db.task.findMany({

              where: {
                assignedToId:
                  input.userId,

                dueDate: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            })

          const contracts =
            await db.contract.findMany({

              where: {
                managerId:
                  input.userId,

                startDate: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            })

          const contractTasks =
            tasks.filter(
              (task) =>
                task.taskType ===
                  'CONTRACT' &&
                task.status ===
                  'DONE'
            )

          const renewalTasks =
            tasks.filter(
              (task) =>
                task.taskType ===
                  'RENEWAL' &&
                task.status ===
                  'DONE'
            )

          const completedTasks =
            tasks.filter(
              (task) =>
                task.status ===
                  'DONE' &&
                task.taskType !==
                  'CONTRACT' &&
                task.taskType !==
                  'RENEWAL'
            )

          const totalContractsAmount =
            contracts.reduce(
              (acc, contract) =>
                acc +
                contract.amount,
              0
            )

          let baseSalary = 50000

          if (
            user.role ===
            'SENIOR_MANAGER'
          ) {
            baseSalary = 65000
          }

          if (
            user.role === 'ADMIN'
          ) {
            baseSalary = 60000
          }

          const contractPercent =
            Math.round(
              totalContractsAmount *
                0.05
            )

          const kpi =
            contractTasks.length *
              3000 +
            renewalTasks.length *
              1500 +
            completedTasks.length *
              500

          const finalSalary =
            baseSalary +
            contractPercent +
            kpi

          return {
            contractTasks:
              contractTasks.length,

            renewalTasks:
              renewalTasks.length,

            completedTasks:
              completedTasks.length,

            totalContractsAmount,

            baseSalary,

            contractPercent,

            kpi,

            finalSalary,
          }
        }),

    generateMonthlyReport:
      protectedProcedure

        .input(
          z.object({
            userId: z.string(),

            year: z.number(),

            month: z.number(),
          })
        )

        .mutation(async ({ input }) => {

          const startDate =
            new Date(
              input.year,
              input.month - 1,
              1
            )

          const endDate =
            new Date(
              input.year,
              input.month,
              0,
              23,
              59,
              59
            )

          const user =
            await db.user.findUnique({
              where: {
                id: input.userId,
              },
            })

          if (!user) {
            throw new Error(
              'Пользователь не найден'
            )
          }

          const tasks =
            await db.task.findMany({

              where: {
                assignedToId:
                  input.userId,

                dueDate: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            })

          const contracts =
            await db.contract.findMany({

              where: {
                managerId:
                  input.userId,

                startDate: {
                  gte: startDate,
                  lte: endDate,
                },
              },
            })

          const contractTasks =
            tasks.filter(
              (task) =>
                task.taskType ===
                  'CONTRACT' &&
                task.status ===
                  'DONE'
            )

          const renewalTasks =
            tasks.filter(
              (task) =>
                task.taskType ===
                  'RENEWAL' &&
                task.status ===
                  'DONE'
            )

          const completedTasks =
            tasks.filter(
              (task) =>
                task.status ===
                  'DONE' &&
                task.taskType !==
                  'CONTRACT' &&
                task.taskType !==
                  'RENEWAL'
            )

          const totalContractsAmount =
            contracts.reduce(
              (acc, contract) =>
                acc +
                contract.amount,
              0
            )

          let baseSalary = 50000

          if (
            user.role ===
            'SENIOR_MANAGER'
          ) {
            baseSalary = 65000
          }

          if (
            user.role === 'ADMIN'
          ) {
            baseSalary = 60000
          }

          const contractPercent =
            Math.round(
              totalContractsAmount *
                0.05
            )

          const kpi =
            contractTasks.length *
              3000 +
            renewalTasks.length *
              1500 +
            completedTasks.length *
              500

          const finalSalary =
            baseSalary +
            contractPercent +
            kpi

          return db.financialRecord.upsert({

            where: {
              userId_periodStart: {
                userId:
                  input.userId,

                periodStart:
                  startDate,
              },
            },

            update: {
              totalIncome:
                totalContractsAmount,

              dealsCount:
                contractTasks.length,

              kpi,

              salary:
                finalSalary,
            },

            create: {
              userId:
                input.userId,

              periodStart:
                startDate,

              periodEnd:
                endDate,

              totalIncome:
                totalContractsAmount,

              dealsCount:
                contractTasks.length,

              kpi,

              salary:
                finalSalary,
            },
          })
        }),

    getHistory:
      protectedProcedure

        .input(
          z.object({
            userId: z.string(),
          })
        )

        .query(async ({ input }) => {

          return db.financialRecord.findMany({

            where: {
              userId:
                input.userId,
            },

            orderBy: {
              periodStart:
                'asc',
            },
          })
        }),
  })