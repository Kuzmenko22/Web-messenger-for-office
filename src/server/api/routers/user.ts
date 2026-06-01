import { z } from "zod"

import {
  createTRPCRouter,
  protectedProcedure,
} from "../trpc"

import { db } from "src/server/db"

import { Role } from "@prisma/client"

import { TRPCError } from '@trpc/server'

import { isAdmin, isSeniorOrAdmin, } from '../../../app/api/auth/check'

export const userRouter = createTRPCRouter({

  getCurrent: protectedProcedure.query(async ({ ctx }) => {

    return db.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
    })
  }),

  getAll: protectedProcedure.query(async () => {

    return db.user.findMany({

      include: {
        tasks: true,
        createdTasks: true,
        contracts: true,
        financials: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    })
  }),

  getPaginated: protectedProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ input }) => {

      const skip =
        (input.page - 1) * input.limit

      const [users, total] =
        await Promise.all([

          db.user.findMany({

            skip,

            take: input.limit,

            include: {
              tasks: true,
              contracts: true,
            },

            orderBy: {
              createdAt: "desc",
            },
          }),

          db.user.count(),
        ])

      return {
        users,
        total,
      }
    }),

  getById: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {

      return db.user.findUnique({
        where: {
          id: input.id,
        },

        include: {
          tasks: {
            include: {
              client: true,
              contract: true,
            },
          },

          createdTasks: true,

          contracts: {
            include: {
              client: true,
            },
          },

          financials: true,
        },
      })
    }),

  search: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(async ({ input }) => {

      return db.user.findMany({

        where: {
          OR: [
            {
              firstname: {
                contains: input.query,
                mode: "insensitive",
              },
            },

            {
              surname: {
                contains: input.query,
                mode: "insensitive",
              },
            },

            {
              email: {
                contains: input.query,
                mode: "insensitive",
              },
            },
          ],
        },

        orderBy: {
          createdAt: "desc",
        },
      })
    }),

  create: protectedProcedure
    .input(
      z.object({

        firstname: z.string(),

        surname: z.string(),

        lastname: z.string().optional(),

        email: z.string().email(),

        phone: z.string().optional(),

        role: z.nativeEnum(Role),
      })
    )
    .mutation(async ({ input, ctx }) => {

      if (!isAdmin(ctx.session)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'Только администратор может создавать пользователей.',
        })
      }

      return db.user.create({
        data: {
          firstname: input.firstname,
          surname: input.surname,
          lastname: input.lastname,

          email: input.email,

          phone: input.phone,

          role: input.role,
        },
      })
    }),

  update: protectedProcedure
    .input(
      z.object({

        id: z.string(),

        firstname: z.string().optional(),

        surname: z.string().optional(),

        lastname: z.string().optional(),

        email: z.string().email().optional(),

        phone: z.string().optional(),

        role: z.nativeEnum(Role).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {

      if (!isAdmin(ctx.session)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'Только администратор может изменять данные пользователей.',
        })
      }

      const { id, ...data } = input

      return db.user.update({
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
    .mutation(async ({ input, ctx }) => {

      if (!isAdmin(ctx.session)) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message:
            'Только администратор может удалять пользователей.',
        })
      }

      return db.user.delete({
        where: {
          id: input.id,
        },
      })
    }),
})