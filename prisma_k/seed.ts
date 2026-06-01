import { PrismaClient, Role, TaskStatus, TaskType } from '@prisma/client'
import { addMonths, subDays, addDays } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  //Пользователи

  const admin = await prisma.user.create({
    data: {
      firstname: 'Александр',
      surname: 'Волков',
      lastname: 'Игоревич',

      email: 'admin@mail.ru',
      phone: '+79979765427',

      role: Role.ADMIN,
    },
  })

  const seniorManager = await prisma.user.create({
    data: {
      firstname: 'Екатерина',
      surname: 'Смирнова',
      lastname: 'Алексеевна',

      email: 'senior@mail.ru',
      phone: '+79513679852',

      role: Role.SENIOR_MANAGER,
    },
  })

  const manager1 = await prisma.user.create({
    data: {
      firstname: 'Иван',
      surname: 'Петров',
      lastname: 'Сергеевич',

      email: 'manager1@mail.ru',
      phone: '+79315676783',

      role: Role.MANAGER,
    },
  })

  const manager2 = await prisma.user.create({
    data: {
      firstname: 'Дмитрий',
      surname: 'Кузнецов',
      lastname: 'Андреевич',

      email: 'manager2@mail.ru',
      phone: '+79996873507',

      role: Role.MANAGER,
    },
  })

  //Клиенты

  const client1 = await prisma.client.create({
    data: {
      name: 'ООО ТехноПром',
      address: 'г. Москва, ул. Ленина, 15',

      inn: '7701234567',
      kpp: '770101001',

      bankAccount: '40702810900000000001',
      bankName: 'ПАО Сбербанк',
      correspondent: '30101810400000000225',

      phone: '+74951235267',
      email: 'technoprom@email.ru',

      contactName: 'Сергей Власов',
      contactPosition: 'Генеральный директор',
      contactPhone: '+79575794750',
    },
  })

  const client2 = await prisma.client.create({
    data: {
      name: 'АО СеверСтрой',
      address: 'г. Санкт-Петербург, Невский пр., 120',

      inn: '7807654321',
      kpp: '780701001',

      bankAccount: '40702810900000000002',
      bankName: 'ВТБ',
      correspondent: '30101810100000000716',

      phone: '+73419681567',
      email: 'sever@mail.ru',

      contactName: 'Ольга Миронова',
      contactPosition: 'Коммерческий директор',
      contactPhone: '+79128888116',
    },
  })

  const client3 = await prisma.client.create({
    data: {
      name: 'ООО Digital Solutions',
      address: 'г. Казань, ул. Баумана, 7',

      inn: '1651234567',
      kpp: '165101001',

      bankAccount: '40702810900000000003',
      bankName: 'Альфа-Банк',
      correspondent: '30101810200000000593',

      phone: '+74567583349',
      email: 'digitalSolutions@mail.ru',

      contactName: 'Максим Орлов',
      contactPosition: 'IT директор',
      contactPhone: '+79111235577',
    },
  })

  //Договора

  const contract1 = await prisma.contract.create({
    data: {
      number: 'TP-2026-001',

      clientId: client1.id,
      managerId: manager1.id,

      startDate: subDays(new Date(), 30),
      endDate: addMonths(new Date(), 11),

      amount: 156500,

      description:
        'Доп. +78517589586',
    },
  })

  const contract2 = await prisma.contract.create({
    data: {
      number: 'SS-2026-014',

      clientId: client2.id,
      managerId: manager2.id,

      startDate: subDays(new Date(), 60),
      endDate: addMonths(new Date(), 6),

      amount: 63200,

      description:
        'Позиция №51',
    },
  })

  const contract3 = await prisma.contract.create({
    data: {
      number: 'DS-2026-008',

      clientId: client3.id,
      managerId: seniorManager.id,

      startDate: subDays(new Date(), 10),
      endDate: addMonths(new Date(), 12),

      amount: 98700,

      description:
        'Информ. через зам.',
    },
  })

  //Задачи

  await prisma.task.createMany({
    data: [
      {
        title: `Продление договора — ${client1.name}`,
        description:
          'Срок согласования - 12',

        taskType: TaskType.RENEWAL,
        status: TaskStatus.IN_PROGRESS,

        dueDate: addDays(new Date(), 5),

        assignedToId: manager1.id,
        createdById: seniorManager.id,

        clientId: client1.id,
        contractId: contract1.id,

        amount: 98100,
        durationMonths: 12,

        priority: 2,
      },

      {
        title: `Расторжение договора — ${client2.name}`,
        description:
          'Закрывающие документы по п.5',

        taskType: TaskType.CANCEL,
        status: TaskStatus.PENDING,

        dueDate: addDays(new Date(), 3),

        assignedToId: manager2.id,
        createdById: admin.id,

        clientId: client2.id,
        contractId: contract2.id,

        priority: 3,
      },

      {
        title: `Заключение договора — ${client3.name}`,
        description:
          'Отправить КП.',

        taskType: TaskType.CONTRACT,
        status: TaskStatus.PENDING,

        dueDate: addDays(new Date(), 10),

        assignedToId: seniorManager.id,
        createdById: admin.id,

        clientId: client3.id,

        amount: 125000,
        durationMonths: 12,

        priority: 1,
      },

      {
        title: 'Подготовка ежемесячного отчета',
        description:
          'Требуется обсуждение аналитики',

        taskType: TaskType.OTHER,
        status: TaskStatus.DONE,

        dueDate: subDays(new Date(), 2),
        completedAt: subDays(new Date(), 1),

        assignedToId: manager1.id,
        createdById: seniorManager.id,

        priority: 1,
      },
    ],
  })

  //Счета

  await prisma.invoice.createMany({
    data: [
      {
        number: 'INV-2026-001',

        contractId: contract1.id,

        issueDate: subDays(new Date(), 20),
        dueDate: addDays(new Date(), 10),

        amount: 78000,
        vatRate: 20,

        executorName: 'ООО ТехноПром',
        inn: client1.inn,
        kpp: client1.kpp,

        bankAccount: client1.bankAccount!,
        bankName: client1.bankName!,
        correspondent: client1.correspondent!,

        legalAddress: client1.address!,

        isPaid: true,
      },

      {
        number: 'INV-2026-002',

        contractId: contract2.id,

        issueDate: subDays(new Date(), 15),
        dueDate: addDays(new Date(), 5),

        amount: 45200,
        vatRate: 20,

        executorName: 'АО СеверСтрой',
        inn: client2.inn,
        kpp: client2.kpp,

        bankAccount: client2.bankAccount!,
        bankName: client2.bankName!,
        correspondent: client2.correspondent!,

        legalAddress: client2.address!,

        isPaid: false,
      },

      {
        number: 'INV-2026-003',

        contractId: contract3.id,

        issueDate: subDays(new Date(), 7),
        dueDate: addDays(new Date(), 14),

        amount: 98600,
        vatRate: 20,

        executorName: 'ООО Digital Solutions',
        inn: client3.inn,
        kpp: client3.kpp,

        bankAccount: client3.bankAccount!,
        bankName: client3.bankName!,
        correspondent: client3.correspondent!,

        legalAddress: client3.address!,

        isPaid: false,
      },
    ],
  })

  //Финансовая статистика

  await prisma.financialRecord.createMany({
    data: [
      {
        userId: manager1.id,

        periodStart: new Date('2026-04-01'),
        periodEnd: new Date('2026-04-30'),

        totalIncome: 540000,
        dealsCount: 5,

        kpi: 11.5,
        salary: 105000,
      },

      {
        userId: manager2.id,

        periodStart: new Date('2026-04-01'),
        periodEnd: new Date('2026-04-30'),

        totalIncome: 385000,
        dealsCount: 3,

        kpi: 7.8,
        salary: 83000,
      },

      {
        userId: seniorManager.id,

        periodStart: new Date('2026-04-01'),
        periodEnd: new Date('2026-04-30'),

        totalIncome: 920000,
        dealsCount: 8,

        kpi: 15.1,
        salary: 131000,
      },
    ],
  })

  console.log('Сохранено успешно')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })