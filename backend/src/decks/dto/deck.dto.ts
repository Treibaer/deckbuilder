import { DeckCardDto } from "./deck-card.dto";

export class DeckDto {
  id: number;
  name: string;
  description: string;
  promoId: string;
  format: string;
  cardCount: number;
  viewCount: number;
  colors: string[];
  commanders: DeckCardDto[];
  mainboard: DeckCardDto[];
  sideboard: DeckCardDto[];
  isFavorite?: boolean;
  isLocked: boolean;
}
