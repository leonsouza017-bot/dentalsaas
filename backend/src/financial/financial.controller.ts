import { Controller, Get, Post, Delete, Param, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { FinancialService } from './financial.service';
import { JwtService } from '@nestjs/jwt';

@Controller('financial')
export class FinancialController {
  constructor(
    private readonly financialService: FinancialService,
    private readonly jwt: JwtService,
  ) {}

  private getClinicId(authorization: string): string {
    if (!authorization) throw new UnauthorizedException('Token não fornecido.');
    const token = authorization.replace('Bearer ', '');
    const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'dentalsaas-secret-key' });
    return payload.clinicId;
  }

  @Get()
  findAll(@Headers('authorization') auth: string) {
    const clinicId = this.getClinicId(auth);
    return this.financialService.findAll(clinicId);
  }

  @Post()
  create(
    @Body() body: { description: string; amount: number; type: string; category: string; dueDate: string },
    @Headers('authorization') auth: string,
  ) {
    const clinicId = this.getClinicId(auth);
    return this.financialService.create(clinicId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('authorization') auth: string) {
    const clinicId = this.getClinicId(auth);
    return this.financialService.remove(id, clinicId);
  }
}