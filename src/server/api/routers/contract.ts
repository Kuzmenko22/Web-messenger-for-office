import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

import { db } from "src/server/db"

import { addMonths } from "date-fns"

export const contractRouter = createTRPCRouter({

  getAll: protectedProcedure.query(async () => {
    return db.contract.findMany({

      include: {
        client: true,
        manager: true,
        tasks: true,
        invoices: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    })
  }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {

      return db.contract.findUnique({
        where: {
          id: input.id,
        },

        include: {
          client: true,
          manager: true,
          tasks: true,
          invoices: true,
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({

        number: z.string(),

        clientId: z.string(),

        managerId: z.string(),

        startDate: z.date(),

        endDate: z.date(),

        amount: z.number(),

        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {

      return db.contract.create({
        data: {
          number: input.number,

          clientId: input.clientId,

          managerId: input.managerId,

          startDate: input.startDate,

          endDate: input.endDate,

          amount: input.amount,

          description: input.description,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({

        id: z.string(),

        number: z.string().optional(),

        managerId: z.string().optional(),

        startDate: z.date().optional(),

        endDate: z.date().optional(),

        amount: z.number().optional(),

        description: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {

      const { id, ...data } = input

      return db.contract.update({
        where: {
          id,
        },

        data: {
          ...(input.number !== undefined && {
            number: input.number,
          }),
  
          ...(input.managerId !== undefined && {
            managerId: input.managerId,
          }),
  
          ...(input.startDate !== undefined && {
            startDate: input.startDate,
          }),
  
          ...(input.endDate !== undefined && {
            endDate: input.endDate,
          }),
  
          ...(input.amount !== undefined && {
            amount: input.amount,
          }),
  
          ...(input.description !== undefined && {
            description: input.description,
          }),
        },
      })
    }),

  renew: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
        months: z.number(),
      })
    )
    .mutation(async ({ input }) => {

      const contract = await db.contract.findUnique({
        where: {
          id: input.contractId,
        },
      })

      if (!contract) {
        throw new Error("Договор не найден")
      }

      const newEndDate = addMonths(
        contract.endDate,
        input.months
      )

      return db.contract.update({
        where: {
          id: contract.id,
        },

        data: {
          endDate: newEndDate,
        },
      })
    }),

  cancel: protectedProcedure
    .input(
      z.object({
        contractId: z.string(),
      })
    )
    .mutation(async ({ input }) => {

      return db.contract.update({
        where: {
          id: input.contractId,
        },

        data: {
          endDate: new Date(),
        },
      })
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {

      return db.contract.delete({
        where: {
          id: input.id,
        },
      })
    }),
})