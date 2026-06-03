import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PatientsModule } from './patients/patients.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { FinancialModule } from './financial/financial.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PatientsModule, AppointmentsModule, FinancialModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
