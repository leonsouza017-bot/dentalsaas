import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PatientsService } from './patients.service';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  // GET /patients
  @Get()
  findAll() {
    return this.patientsService.findAll();
  }

  // GET /patients/:id
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(id);
  }

  // POST /patients
  @Post()
  create(
    @Body()
    body: {
      name: string;
      phone: string;
      email?: string;
      notes?: string;
    },
  ) {
    return this.patientsService.create(body);
  }

  // PUT /patients/:id
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    body: { name?: string; phone?: string; email?: string; notes?: string },
  ) {
    return this.patientsService.update(id, body);
  }

  // DELETE /patients/:id
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(id);
  }
}
