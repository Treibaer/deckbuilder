import { Test, TestingModule } from "@nestjs/testing";
import { DecksService } from "./decks.service";
import { DeckTransformer } from "./deck.transformer";

describe("DecksService", () => {
  let service: DecksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DecksService,
        DeckTransformer,
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

    service = module.get<DecksService>(DecksService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
