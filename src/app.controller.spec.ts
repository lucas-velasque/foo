// src/app.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
    appService = app.get<AppService>(AppService);
  });

  describe('root', () => {
    it('should return the welcome message', () => {
      jest.spyOn(appService, 'getApiRootMessage').mockReturnValue('Welcome to the Aluguel Social API!');
      expect(appController.getApiRoot()).toBe('Welcome to the Aluguel Social API!');
    });
  });
});