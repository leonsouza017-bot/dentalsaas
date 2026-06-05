import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class AppointmentsService {
  async findAll() {
    return prisma.appointment.findMany({
      include: { patient: true },
      orderBy: { startAt: 'asc' },
    });
  }

  async findOne(id: string) {
    return prisma.appointment.findUnique({
      where: { id },
      include: { patient: true },
    });
  }

  async create(data: {
    title: string;
    patientId: string;
    startAt: string;
    endAt: string;
    price?: number;
  }) {
    return prisma.appointment.create({
      data: {
        title: data.title,
        patientId: data.patientId,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        price: data.price ?? null,
      },
      include: { patient: true },
    });
  }

  async update(
    id: string,
    data: {
      title?: string;
      status?: string;
      price?: number;
    },
  ) {
    return prisma.appointment.update({
      where: { id },
      data,
      include: { patient: true },
    });
  }

  async remove(id: string) {
    return prisma.appointment.delete({ where: { id } });
  }
}
