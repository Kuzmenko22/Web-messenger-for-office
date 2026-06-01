import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc'

import { db } from 'src/server/db'

import {
  startOfMonth,
  endOfMonth,
  addMonths,
} from 'date-fns'

import {
  TaskStatus,
  TaskType,
} from '@prisma/client'

export const taskRouter =
  createTRPCRouter({

    getByMonth:
      protectedProcedure
        .input(
          z.object({
            date: z.date(),
          })
        )
        .query(
          async ({ input }) => {
            return db.task.findMany({
              where: {
                dueDate: {
                  gte:
                    startOfMonth(
                      input.date
                    ),

                  lte:
                    endOfMonth(
                      input.date
                    ),
                },
              },

              include: {
                assignedTo: true,
                createdBy: true,
                client: true,
                contract: true,
              },

              orderBy: {
                dueDate: 'asc',
              },
            })
          }
        ),

    getById:
      protectedProcedure
        .input(
          z.object({
            id: z.string(),
          })
        )
        .query(
          async ({ input }) => {
            return db.task.findUnique(
              {
                where: {
                  id: input.id,
                },

                include: {
                  assignedTo: true,
                  createdBy: true,
                  client: true,
                  contract: true,
                },
              }
            )
          }
        ),

    create:
      protectedProcedure
        .input(
          z.object({
            title: z.string(),

            description:
              z.string().optional(),

            dueDate: z.date(),

            taskType:
              z.nativeEnum(
                TaskType
              ),

            assignedToId:
              z.string(),

            clientId:
              z.string()
                .nullable()
                .optional(),

            contractId:
              z.string()
                .nullable()
                .optional(),

            amount:
              z.number().optional(),

            durationMonths:
              z.number().optional(),

            priority:
              z.number().optional(),
          })
        )
        .mutation(
          async ({
            input,
            ctx,
          }) => {
            return db.task.create({
              data: {
                title:
                  input.title,

                description:
                  input.description,

                dueDate:
                  input.dueDate,

                taskType:
                  input.taskType,

                status:
                  TaskStatus.PENDING,

                assignedToId:
                  input.assignedToId,

                createdById:
                  ctx.session.user.id,

                clientId:
                  input.clientId ??
                  null,

                contractId:
                  input.contractId ??
                  null,

                amount:
                  input.amount,

                durationMonths:
                  input.durationMonths,

                priority:
                  input.priority ??
                  1,
              },
            })
          }
        ),

        update: protectedProcedure
        .input(
          z.object({
            id: z.string(),
      
            title: z.string().optional(),
            description: z.string().optional(),
            dueDate: z.date().optional(),
      
            taskType: z.nativeEnum(TaskType).optional(),
            status: z.nativeEnum(TaskStatus).optional(),
      
            assignedToId: z.string().optional(),
            clientId: z.string().nullable().optional(),
            contractId: z.string().nullable().optional(),
      
            amount: z.number().optional(),
            durationMonths: z.number().optional(),
          })
        )
        .mutation(async ({ input }) => {
          const { id, ...data } = input
      
          return db.task.update({
            where: { id },
            data,
          })
        }),

    complete:
      protectedProcedure
        .input(
          z.object({
            taskId: z.string(),
          })
        )
        .mutation(
          async ({ input }) => {
            const task =
              await db.task.findUnique(
                {
                  where: {
                    id: input.taskId,
                  },

                  include: {
                    client: true,
                    contract: true,
                  },
                }
              )

            if (!task) {
              throw new Error(
                'Task not found'
              )
            }

            if (
              task.taskType ===
                'CONTRACT' &&
              task.clientId
            ) {
              const contract =
                await db.contract.create(
                  {
                    data: {
                      number: `AUTO-${Date.now()}`,

                      clientId:
                        task.clientId,

                      managerId:
                        task.assignedToId,

                      startDate:
                        new Date(),

                      endDate:
                        addMonths(
                          new Date(),
                          task.durationMonths ??
                            12
                        ),

                      amount:
                        task.amount ??
                        0,

                      description:
                        task.description ??
                        null,
                    },
                  }
                )

              await db.task.update({
                where: {
                  id: task.id,
                },

                data: {
                  contractId:
                    contract.id,
                },
              })
            }

            if (
              task.taskType ===
                'RENEWAL' &&
              task.contractId
            ) {
              const contract =
                await db.contract.findUnique(
                  {
                    where: {
                      id: task.contractId,
                    },
                  }
                )

              if (contract) {
                await db.contract.update(
                  {
                    where: {
                      id: contract.id,
                    },

                    data: {
                      endDate:
                        addMonths(
                          contract.endDate,
                          task.durationMonths ??
                            1
                        ),
                    },
                  }
                )
              }
            }

            if (
              task.taskType ===
                'CANCEL' &&
              task.contractId
            ) {
              await db.contract.update({
                where: {
                  id: task.contractId,
                },

                data: {
                  endDate:
                    new Date(),
                },
              })
            }

            return db.task.update({
              where: {
                id: task.id,
              },

              data: {
                status:
                  TaskStatus.DONE,

                completedAt:
                  new Date(),
              },
            })
          }
        ),

    start:
      protectedProcedure
        .input(
          z.object({
            taskId: z.string(),
          })
        )
        .mutation(
          async ({ input }) => {
            return db.task.update({
              where: {
                id: input.taskId,
              },

              data: {
                status:
                  TaskStatus.IN_PROGRESS,
              },
            })
          }
        ),

    cancelStatus:
      protectedProcedure
        .input(
          z.object({
            taskId: z.string(),
          })
        )
        .mutation(
          async ({ input }) => {
            return db.task.update({
              where: {
                id: input.taskId,
              },

              data: {
                status:
                  TaskStatus.CANCELLED,
              },
            })
          }
        ),

    delete:
      protectedProcedure
        .input(
          z.object({
            id: z.string(),
          })
        )
        .mutation(
          async ({ input }) => {
            return db.task.delete({
              where: {
                id: input.id,
              },
            })
          }
        ),
  })
