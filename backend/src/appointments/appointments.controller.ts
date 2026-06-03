import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Post()
  create(
    @Body()
    body: {
      title: string;
      patientId: string;
      startAt: string;
      endAt: string;
      price?: number;
    },
  ) {
    return this.appointmentsService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title?: string; status?: string; price?: number },
  ) {
    return this.appointmentsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(id);
  }
}
