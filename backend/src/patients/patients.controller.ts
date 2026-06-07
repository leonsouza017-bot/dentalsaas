import { Controller, Get, Post, Put, Delete, Param, Body, Headers, UnauthorizedException } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { JwtService } from '@nestjs/jwt';

@Controller('patients')
export class PatientsController {
  constructor(
    private readonly patientsService: PatientsService,
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
    return this.patientsService.findAll(clinicId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Headers('authorization') auth: string) {
    const clinicId = this.getClinicId(auth);
    return this.patientsService.findOne(id, clinicId);
  }

  @Post()
  create(
    @Body() body: { name: string; phone: string; email?: string; notes?: string },
    @Headers('authorization') auth: string,
  ) {
    const clinicId = this.getClinicId(auth);
    return this.patientsService.create(clinicId, body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { name?: string; phone?: string; email?: string; notes?: string },
    @Headers('authorization') auth: string,
  ) {
    const clinicId = this.getClinicId(auth);
    return this.patientsService.update(id, clinicId, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Headers('authorization') auth: string) {
    const clinicId = this.getClinicId(auth);
    return this.patientsService.remove(id, clinicId);
  }
}