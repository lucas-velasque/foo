import { Module } from '@nestjs/common';
import { SocialAssistanceService } from './social-assistance.service';
import { SocialAssistanceController } from './social-assistance.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { SocialAssistance } from './entities/social-assistance.entity';
import { SocialAssistanceRepository } from './repositories/social-assistance.repository';

@Module({
  imports: [SequelizeModule.forFeature([SocialAssistance])],
  controllers: [SocialAssistanceController],
  providers: [SocialAssistanceService, SocialAssistanceRepository],
  exports: [SocialAssistanceService], 
})
export class SocialAssistanceModule {}