import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly instanceId = process.env.ZAPI_INSTANCE_ID;
  private readonly token = process.env.ZAPI_TOKEN;
  private readonly baseUrl = `https://api.z-api.io/instances/${this.instanceId}/token/${this.token}`;

  async sendWhatsApp(phone: string, message: string): Promise<void> {
    try {
      const cleanPhone = phone.replace(/\D/g, '');
      const fullPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;

      await axios.post(`${this.baseUrl}/send-text`, {
        phone: fullPhone,
        message,
      });

      console.log(`✅ WhatsApp enviado para ${fullPhone}`);
    } catch (error) {
      console.error(`❌ Erro ao enviar WhatsApp:`, error);
    }
  }

  async sendAppointmentReminder(
    patientName: string,
    phone: string,
    date: string,
    time: string,
  ): Promise<void> {
    const message = `Olá, ${patientName}! 😊\n\nEste é um lembrete da sua consulta:\n\n📅 *Data:* ${date}\n🕐 *Horário:* ${time}\n\nQualquer dúvida, responda esta mensagem.\n\n_Denty – Gestão Odontológica_`;

    await this.sendWhatsApp(phone, message);
  }

  async sendAppointmentConfirmation(
    patientName: string,
    phone: string,
    date: string,
    time: string,
  ): Promise<void> {
    const message = `Olá, ${patientName}! ✅\n\nSua consulta foi confirmada com sucesso!\n\n📅 *Data:* ${date}\n🕐 *Horário:* ${time}\n\nTe esperamos! 😄\n\n_Denty – Gestão Odontológica_`;

    await this.sendWhatsApp(phone, message);
  }
}