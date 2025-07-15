import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PropertiesModule } from './properties/properties.module';
import { BookingsModule } from './bookings/bookings.module';
import { WorkCreditsModule } from './work-credits/work-credits.module';
import { ConfigurationModule } from './config/config.module';
import { DatabaseModule } from './config/database.module';
import { SharedModule } from './shared/shared.module';
import { SocialAssistanceModule } from './social-assistance/social-assistance.module';
import { TasksModule } from './tasks/tasks.module';
import { CommentsModule } from './comments/comments.module';
import { SuggestionsModule } from './suggestions/suggestions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConfigurationModule,
    DatabaseModule,
    SharedModule,
    AuthModule,
    UsersModule,
    PropertiesModule,
    BookingsModule,
    WorkCreditsModule,
    SocialAssistanceModule,
    TasksModule,
    CommentsModule,
    SuggestionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
