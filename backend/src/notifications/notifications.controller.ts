import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('send')
  async send(@Body() body: { phone: string; message: string }) {
    await this.notificationsService.sendWhatsApp(body.phone, body.message);
    return { message: 'Mensagem enviada com sucesso!' };
  }

  @Post('reminder')
  async reminder(
    @Body()
    body: {
      patientName: string;
      phone: string;
      date: string;
      time: string;
    },
  ) {
    await this.notificationsService.sendAppointmentReminder(
      body.patientName,
      body.phone,
      body.date,
      body.time,
    );
    return { message: 'Lembrete enviado com sucesso!' };
  }
}