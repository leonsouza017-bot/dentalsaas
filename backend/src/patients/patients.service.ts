import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PatientsService {
  async findAll() {
    return prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    return prisma.patient.findUnique({
      where: { id },
    });
  }

  async create(data: {
    name: string;
    phone: string;
    email?: string;
    notes?: string;
  }) {
    return prisma.patient.create({ data });
  }

  async update(
    id: string,
    data: { name?: string; phone?: string; email?: string; notes?: string },
  ) {
    return prisma.patient.update({ where: { id }, data });
  }

  async remove(id: string) {
    return prisma.patient.delete({ where: { id } });
  }
}
