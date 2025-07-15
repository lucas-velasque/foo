import { Module } from '@nestjs/common';
import { WorkCreditsService } from './work-credits.service';
import { WorkCreditsController } from './work-credits.controller';
import { CreditPurchasesController } from './credit-purchases.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { WorkCredit } from './entities/work-credit.entity';
import { WorkCreditsRepository } from './repositories/work-credits.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [SequelizeModule.forFeature([WorkCredit]), UsersModule],
  controllers: [WorkCreditsController, CreditPurchasesController],
  providers: [WorkCreditsService, WorkCreditsRepository],
  exports: [WorkCreditsService, WorkCreditsRepository],
})
export class WorkCreditsModule {}