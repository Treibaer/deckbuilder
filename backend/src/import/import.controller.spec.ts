import { Test, TestingModule } from '@nestjs/testing';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';
import { Sequelize } from 'sequelize-typescript';

describe('ImportController', () => {
  let controller: ImportController;
  let service: ImportService;

  const mockSequelize = {
    authenticate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ImportController],
      providers: [ImportService, {
        provide: Sequelize,
        useValue: mockSequelize
      }],
    }).compile();

    controller = module.get<ImportController>(ImportController);
    service = module.get<ImportService>(ImportService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
