import { DeckCard } from "../../pages/deck";

export type DeckStructure = {
  [key: string]: DeckCard[];
};

export enum CardSize {
  small = "small",
  normal = "normal",
  large = "large",
}

export enum CardStyle {
  cards = "cards",
  list = "list",
}
