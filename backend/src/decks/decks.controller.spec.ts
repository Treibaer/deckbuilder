import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "src/users/users.service";
import { DeckTransformer } from "./deck.transformer";
import { DecksController } from "./decks.controller";
import { DecksService } from "./decks.service";

describe("DecksController", () => {
  let controller: DecksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DecksController],
      providers: [
        DecksService,
        DeckTransformer,
        UsersService,
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
