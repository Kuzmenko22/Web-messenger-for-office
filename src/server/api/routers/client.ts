import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"
import { db } from "src/server/db"

export const clientRouter = createTRPCRouter({

  getAll: protectedProcedure.query(async () => {
    return db.client.findMany({

      include: {
        contracts: true,
        tasks: true,
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
  
      return db.client.findUnique({
        where: {
          id: input.id,
        },
  
        include: {
          contracts: {
            include: {
              manager: true,
              invoices: true,
              tasks: true,
            },
  
            orderBy: {
              createdAt: "desc",
            },
          },
  
          tasks: {
            include: {
              assignedTo: true,
              contract: true,
            },
  
            orderBy: {
              dueDate: "asc",
            },
          },
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({

        name: z.string(),

        inn: z.string(),

        address: z.string().optional(),

        kpp: z.string().optional(),

        bankAccount: z.string().optional(),
        bankName: z.string().optional(),
        correspondent: z.string().optional(),

        phone: z.string().optional(),

        email: z.string().optional(),

        contactName: z.string().optional(),
        contactPosition: z.string().optional(),
        contactPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {

      return db.client.create({
        data: input,
      })
    }),

  update: protectedProcedure
    .input(
      z.object({

        id: z.string(),

        name: z.string().optional(),

        inn: z.string().optional(),

        address: z.string().optional(),

        kpp: z.string().optional(),

        bankAccount: z.string().optional(),
        bankName: z.string().optional(),
        correspondent: z.string().optional(),

        phone: z.string().optional(),

        email: z.string().optional(),

        contactName: z.string().optional(),
        contactPosition: z.string().optional(),
        contactPhone: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {

      const { id, ...data } = input

      return db.client.update({
        where: {
          id,
        },

        data,
      })
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input }) => {

      return db.client.delete({
        where: {
          id: input.id,
        },
      })
    }),
})