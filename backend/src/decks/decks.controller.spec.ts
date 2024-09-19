import { Test, TestingModule } from "@nestjs/testing";
import { DecksController } from "./decks.controller";
import { DecksService } from "./decks.service";
import { DeckTransformer } from "./deck.transformer";

describe("DecksController", () => {
  let controller: DecksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecksController],
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

    controller = module.get<DecksController>(DecksController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
