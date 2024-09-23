import { Test, TestingModule } from "@nestjs/testing";
import { ImportService } from "./import.service";
import { Sequelize } from "sequelize-typescript";

describe("ImportService", () => {
  let service: ImportService;

  const mockSequelize = {
    authenticate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImportService,
        {
          provide: Sequelize,
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get<ImportService>(ImportService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
