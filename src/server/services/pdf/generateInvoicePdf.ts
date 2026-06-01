import path from 'path'

const PDFDocument = eval('require')('pdfkit')

export const generateInvoicePdf =
  async (
    invoice: any
  ): Promise<Buffer> => {

    const doc =
      new PDFDocument({
        size: 'A4',
        margin: 40,
      })

    const buffers: Buffer[] = []

    doc.on(
      'data',
      (chunk: Buffer) => {
        buffers.push(chunk)
      }
    )

    return new Promise(
      (resolve, reject) => {

        doc.on(
          'end',
          () => {

            const pdfBuffer =
              Buffer.concat(buffers)

            resolve(pdfBuffer)
          }
        )

        doc.on(
          'error',
          reject
        )

        try {

          const fontPath =
            path.join(
              process.cwd(),
              'src',
              'server',
              'services',
              'pdf',
              'fonts',
              'arial.ttf'
            )

          doc.registerFont(
            'Arial',
            fontPath
          )

          doc.font('Arial')

          const client =
            invoice.contract.client

          const amount =
            invoice.amount

          const vat =
            Math.round(
              amount *
                (invoice.vatRate / 100)
            )

          const total =
            amount + vat

          doc
            .fontSize(18)
            .text(
              'ВНИМАНИЕ! СВЕРЬТЕ РЕКВИЗИТЫ!',
              {
                align: 'center',
              }
            )

          doc.moveDown(0.5)

          doc
            .fontSize(16)
            .text(
              `СЧЕТ ${invoice.number} от ${new Date(
                invoice.issueDate
              ).toLocaleDateString(
                'ru-RU'
              )}`,
              {
                align: 'center',
              }
            )

          doc.moveDown(2)

          doc
            .fontSize(12)
            .text(
              `Получатель платежа: ${invoice.executorName}`
            )

          doc.moveDown()

          doc.text(
            `ИНН/КПП: ${invoice.inn}/${invoice.kpp ?? '-'}`
          )

          doc.moveDown()

          doc.text(
            `Р/с: ${invoice.bankAccount}`
          )

          doc.text(
            `Банк: ${invoice.bankName}`
          )

          doc.text(
            `Корр. счет: ${invoice.correspondent}`
          )

          doc.moveDown()

          doc.text(
            `Юридический адрес: ${invoice.legalAddress}`
          )

          doc.moveDown()

          doc.text(
            `Заказчик: ${client.name}`
          )

          doc.moveDown(2)


        const tableTop = 320

        const col1 = 40
        const col2 = 280
        const col3 = 360
        const col4 = 440
        const col5 = 510
        const col6 = 560
        
        const rowHeight = 30
        
        
        doc
          .moveTo(col1, tableTop)
          .lineTo(col6, tableTop)
          .stroke()
        
        doc
          .moveTo(col1, tableTop + rowHeight)
          .lineTo(col6, tableTop + rowHeight)
          .stroke()
        
        doc
          .moveTo(col1, tableTop + rowHeight * 3)
          .lineTo(col6, tableTop + rowHeight * 3)
          .stroke()
        
    
        doc
          .moveTo(col1, tableTop)
          .lineTo(col1, tableTop + rowHeight * 3)
          .stroke()
        
        doc
          .moveTo(col2, tableTop)
          .lineTo(col2, tableTop + rowHeight * 3)
          .stroke()
        
        doc
          .moveTo(col3, tableTop)
          .lineTo(col3, tableTop + rowHeight * 3)
          .stroke()
        
        doc
          .moveTo(col4, tableTop)
          .lineTo(col4, tableTop + rowHeight * 3)
          .stroke()
        
        doc
          .moveTo(col5, tableTop)
          .lineTo(col5, tableTop + rowHeight * 3)
          .stroke()
        
        doc
          .moveTo(col6, tableTop)
          .lineTo(col6, tableTop + rowHeight * 3)
          .stroke()
        

        
        doc
          .fontSize(9)
          .text(
            'Наименование услуги',
            col1 + 8,
            tableTop + 10,
            {
              width: 220,
            }
          )
        
        doc.text(
          'Сумма',
          col2 + 8,
          tableTop + 10
        )
        
        doc.text(
          'Ставка НДС',
          col3 + 8,
          tableTop + 10
        )
        
        doc.text(
          'Сумма НДС',
          col4 + 8,
          tableTop + 10
        )
        
        doc.text(
          'Итого',
          col5 + 8,
          tableTop + 10
        )
        
        
        doc.text(
          `Услуги по договору № ${invoice.contract.number}`,
          col1 + 8,
          tableTop + 45,
          {
            width: 220,
          }
        )
        
        doc.text(
          `${amount.toLocaleString()} р.`,
          col2 + 8,
          tableTop + 45
        )
        
        doc.text(
          '22%',
          col3 + 18,
          tableTop + 45
        )
        
        doc.text(
          `${vat.toLocaleString()} р.`,
          col4 + 8,
          tableTop + 45
        )
        
        doc.text(
          `${total.toLocaleString()} р.`,
          col5 + 8,
          tableTop + 45
        )
        
        
        doc.moveDown(8)
        
        doc
            .fontSize(14)
            .text(
                `Всего к оплате: ${total.toLocaleString()} р.`,
                300,
                doc.y,
                {
                    width: 250,
                    align: 'right',
                }
            )
        
        
        doc.moveDown(5)
        
        const signY = doc.y
        
        doc
          .fontSize(12)
          .text(
            'Директор филиала',
            40,
            signY
          )
        
          doc.text(
            '___________________',
            240,
            signY
          )
          
          doc
            .fontSize(9)
            .text(
              '(Подпись)',
              255,
              signY + 18
            )
        
        doc.text(
          'Пимиков А.В.',
          430,
          signY
        )
        
        doc.end()
        

        } catch (error) {

          console.error(error)

          reject(error)
        }
      }
    )
  }