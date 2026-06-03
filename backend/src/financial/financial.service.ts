import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

@Injectable()
export class FinancialService {
  async findAll() {
    return prisma.transaction.findMany({
      orderBy: { dueDate: 'desc' },
    });
  }

  async create(data: {
    description: string;
    amount: number;
    type: string;
    category: string;
    dueDate: string;
  }) {
    return prisma.transaction.create({
      data: {
        description: data.description,
        amount: data.amount,
        type: data.type as any,
        category: data.category,
        dueDate: new Date(data.dueDate),
      },
    });
  }

  async remove(id: string) {
    return prisma.transaction.delete({ where: { id } });
  }
}