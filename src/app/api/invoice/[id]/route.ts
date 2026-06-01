import { NextResponse } from 'next/server'

import { db } from '~/server/db'

import { generateInvoicePdf } from '~/server/services/pdf/generateInvoicePdf'

export const runtime = 'nodejs'

export async function GET(
  request: Request,
  {
    params,
  }: {
    params: {
      id: string
    }
  }
) {
  try {

    const invoice =
      await db.invoice.findUnique({

        where: {
          id: params.id,
        },

        include: {
          contract: {
            include: {
              client: true,
            },
          },
        },
      })

    if (!invoice) {

      return NextResponse.json(
        {
          error:
            'Счет не найден',
        },
        {
          status: 404,
        }
      )
    }

    const pdfBuffer =
      await generateInvoicePdf(
        invoice
      )

    const uint8Array =
      new Uint8Array(pdfBuffer)

    return new Response(
      uint8Array,
      {
        headers: {

          'Content-Type':
            'application/pdf',

          'Content-Disposition':
            `attachment; filename="invoice-${invoice.id}.pdf"`,

          'Content-Length':
            pdfBuffer.length.toString(),
        },
      }
    )

  } catch (error) {

    console.error(error)

    return NextResponse.json(
      {
        error:
          'Ошибка генерации PDF',
      },
      {
        status: 500,
      }
    )
  }
}