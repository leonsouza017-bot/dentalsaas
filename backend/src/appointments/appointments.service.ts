import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotificationsService } from '../notifications/notifications.service';

const prisma = new PrismaClient();

@Injectable()
export class AppointmentsService {
  constructor(private notifications: NotificationsService) {}

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
    const appointment = await prisma.appointment.create({
      data: {
        title: data.title,
        patientId: data.patientId,
        startAt: new Date(data.startAt),
        endAt: new Date(data.endAt),
        price: data.price ?? null,
      },
      include: { patient: true },
    });

    // Envia confirmação automática pelo WhatsApp
    if (appointment.patient.phone) {
      const date = new Date(data.startAt).toLocaleDateString('pt-BR');
      const time = new Date(data.startAt).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });

      await this.notifications.sendAppointmentConfirmation(
        appointment.patient.name,
        appointment.patient.phone,
        date,
        time,
      );
    }

    return appointment;
  }

  async update(id: string, data: { title?: string; status?: string; price?: number }) {
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