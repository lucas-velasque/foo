// src/config/database.config.ts
import { SequelizeModuleOptions } from '@nestjs/sequelize';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { WorkCredit } from '../work-credits/entities/work-credit.entity';
import { SocialAssistance } from '../social-assistance/entities/social-assistance.entity';
import { Task } from '../tasks/entities/task.entity';
import { UserTask } from '../tasks/entities/user-task.entity';
import * as path from 'path';

export const databaseConfig = {
  useFactory: async (configService: ConfigService): Promise<SequelizeModuleOptions> => {
    const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
    
    // Configuração para SQLite
    return {
      dialect: 'sqlite',
      storage: path.join(process.cwd(), 'database.sqlite'),
      autoLoadModels: true,
      synchronize: true,
      logging: isDevelopment,
      models: [User, Property, Booking, WorkCredit, SocialAssistance, Task, UserTask],
      dialectOptions: {
        // Habilitar foreign keys no SQLite
        foreignKeys: true,
      },
      define: {
        timestamps: true,
        underscored: true,
      },
    };
  },
  inject: [ConfigService],
};
