import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { FinancialService } from './financial.service';

@Controller('financial')
export class FinancialController {
  constructor(private readonly financialService: FinancialService) {}

  @Get()
  findAll() {
    return this.financialService.findAll();
  }

  @Post()
  create(
    @Body()
    body: {
      description: string;
      amount: number;
      type: string;
      category: string;
      dueDate: string;
    },
  ) {
    return this.financialService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financialService.remove(id);
  }
}
