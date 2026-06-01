import { z } from 'zod'

import {
  createTRPCRouter,
  protectedProcedure,
} from '../trpc'

import { db } from '~/server/db'

export const invoicesRouter =
  createTRPCRouter({

    create:
      protectedProcedure

        .input(
          z.object({
            contractId: z.string(),

            issueDate: z.date(),

            dueDate: z.date().optional(),

            vatRate: z.number(),

            executorName: z.string(),

            inn: z.string(),

            kpp: z.string().optional(),

            bankAccount: z.string(),

            bankName: z.string(),

            correspondent:
              z.string(),

            legalAddress:
              z.string(),
          })
        )

        .mutation(
          async ({ input }) => {

            const contract =
              await db.contract.findUnique({
                where: {
                  id: input.contractId,
                },

                include: {
                  client: true,
                },
              })

            if (!contract) {
              throw new Error(
                'Договор не найден'
              )
            }

            const lastInvoice =
                await db.invoice.findFirst({
                    orderBy: {
                        createdAt: 'desc',
                    },
                })

            const nextNumber =
                lastInvoice
                    ? Number(
                        lastInvoice.number
                            .split('-')
                            .pop()
                    ) + 1
                : 1

            const invoiceNumber =
                `СЧ-${new Date().getFullYear()}-${String(
                    nextNumber
                ).padStart(4, '0')}`

            const invoice =
              await db.invoice.create({

                data: {
                  number:
                    invoiceNumber,

                  contractId:
                    contract.id,

                  issueDate:
                    input.issueDate,

                  dueDate:
                    input.dueDate,

                  amount:
                    contract.amount,

                  vatRate:
                    input.vatRate,

                  executorName:
                    input.executorName,

                  inn:
                    input.inn,

                  kpp:
                    input.kpp,

                  bankAccount:
                    input.bankAccount,

                  bankName:
                    input.bankName,

                  correspondent:
                    input.correspondent,

                  legalAddress:
                    input.legalAddress,
                },

                include: {
                  contract: {
                    include: {
                      client: true,
                    },
                  },
                },
              })

            return invoice
          }
        ),

    getAll:
      protectedProcedure

        .query(async () => {

          return db.invoice.findMany({

            include: {
              contract: {
                include: {
                  client: true,
                },
              },
            },

            orderBy: {
              createdAt: 'desc',
            },
          })
        }),

    togglePaid:
      protectedProcedure

        .input(
          z.object({
            id: z.string(),
            isPaid: z.boolean(),
          })
        )

        .mutation(
          async ({ input }) => {

            return db.invoice.update({
              where: {
                id: input.id,
              },

              data: {
                isPaid:
                  input.isPaid,
              },
            })
          }
        ),
  })