import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { FinancialController } from './financial.controller';
import { FinancialService } from './financial.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dentalsaas-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [FinancialController],
  providers: [FinancialService],
})
export class FinancialModule {}