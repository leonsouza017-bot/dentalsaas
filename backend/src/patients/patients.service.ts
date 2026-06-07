import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class PatientsService {
  async findAll(clinicId: string) {
    return prisma.patient.findMany({
      where: { clinicId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, clinicId: string) {
    return prisma.patient.findFirst({
      where: { id, clinicId },
    });
  }

  async create(clinicId: string, data: { name: string; phone: string; email?: string; notes?: string }) {
    return prisma.patient.create({
      data: { ...data, clinicId },
    });
  }

  async update(id: string, clinicId: string, data: { name?: string; phone?: string; email?: string; notes?: string }) {
    return prisma.patient.update({
      where: { id },
      data,
    });
  }

  async remove(id: string, clinicId: string) {
    return prisma.patient.delete({
      where: { id },
    });
  }
}