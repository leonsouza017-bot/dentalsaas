import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class FinancialService {
  async findAll(clinicId: string) {
    return prisma.transaction.findMany({
      where: { clinicId },
      orderBy: { dueDate: 'desc' },
    });
  }

  async create(clinicId: string, data: {
    description: string;
    amount: number;
    type: string;
    category: string;
    dueDate: string;
  }) {
    return prisma.transaction.create({
      data: {
        clinicId,
        description: data.description,
        amount: data.amount,
        type: data.type,
        category: data.category,
        dueDate: new Date(data.dueDate),
      },
    });
  }

  async remove(id: string, clinicId: string) {
    return prisma.transaction.delete({ where: { id } });
  }
}