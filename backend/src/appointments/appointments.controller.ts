import { Controller, Get, Post, Put, Delete, Param, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { JwtService } from '@nestjs/jwt';

@Controller('appointments')
export class AppointmentsController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
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
    return this.appointmentsService.findAll(clinicId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('authorization') auth: string) {
    const clinicId = this.getClinicId(auth);
    return this.appointmentsService.findOne(id, clinicId);
  }

  @Post()
  create(
    @Body() body: { title: string; patientId: string; startAt: string; endAt: string; price?: number },
    @Headers('authorization') auth: string,
  ) {
    const clinicId = this.getClinicId(auth);
    return this.appointmentsService.create(clinicId, body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; status?: string; price?: number },
    @Headers('authorization') auth: string,
  ) {
    const clinicId = this.getClinicId(auth);
    return this.appointmentsService.update(id, clinicId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('authorization') auth: string) {
    const clinicId = this.getClinicId(auth);
    return this.appointmentsService.remove(id, clinicId);
  }
}