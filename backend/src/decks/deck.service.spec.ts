import { Test, TestingModule } from "@nestjs/testing";
import { DeckService } from "./deck.service";
import { DeckTransformer } from "./deck.transformer";
import { UserService } from "../users/user.service";

describe("DeckService", () => {
  let service: DeckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeckService,
        DeckTransformer,
        UserService,
        {
          provide: "DeckRepository", // Mocking DeckRepository
          useValue: {
            // Mock implementation
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DeckService>(DeckService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
