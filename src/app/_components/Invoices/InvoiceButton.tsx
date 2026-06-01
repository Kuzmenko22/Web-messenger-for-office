'use client'

import { api } from '~/trpc/react'

interface Props {
  contractId: string
}

const InvoiceButton = ({
  contractId,
}: Props) => {

  const createInvoice =
    api.invoice.create.useMutation()

  const handleCreate =
    async () => {

      try {

        const invoice =
          await createInvoice.mutateAsync({

            contractId,

            issueDate:
              new Date(),

            vatRate: 22,

            executorName:
              'ООО "ДубльГИС"',

            inn: '5405276278',

            kpp: '997750001',

            bankAccount:
              '40702810344050002658',

            bankName:
              'СИБИРСКИЙ БАНК ПАО СБЕРБАНК',

            correspondent:
              '30101810500000000641',

            legalAddress:
              '630048, г. Новосибирск, пл. Карла Маркса, д. 7',
          })

        window.open(
          `/api/invoice/${invoice.id}`,
          '_blank'
        )

      } catch (e) {

        console.error(e)

        alert(
          'Ошибка создания счета'
        )
      }
    }

  return (
    <button
      onClick={handleCreate}
      className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
    >
      Экспорт счета в PDF
    </button>
  )
}

export default InvoiceButton