import { Controller, Get, Post, Headers, UnauthorizedException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtService } from '@nestjs/jwt';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly jwt: JwtService,
  ) {}

  private getClinicData(authorization: string) {
    if (!authorization) throw new UnauthorizedException('Token não fornecido.');
    const token = authorization.replace('Bearer ', '');
    const payload = this.jwt.verify(token, {
      secret: process.env.JWT_SECRET || 'dentalsaas-secret-key',
    });
    return { clinicId: payload.clinicId, email: payload.email };
  }

  @Post('checkout')
  async createCheckout(@Headers('authorization') auth: string) {
    const { clinicId, email } = this.getClinicData(auth);
    return this.paymentsService.createCheckoutSession(clinicId, email);
  }

  @Get('status')
  async getStatus(@Headers('authorization') auth: string) {
    const { clinicId } = this.getClinicData(auth);
    return this.paymentsService.getSubscriptionStatus(clinicId);
  }
}