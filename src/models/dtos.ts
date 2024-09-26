export type CardDetailWithPrintings = {
  card: MagicCard;
  printings: MagicCard[];
};
export type MagicCard = {
  scryfallId: string;
  name: string;
  typeLine: string;
  reprint: boolean;
  printSearchUri: string;
  cardFaces: string[];
  releasedAt: string;
  setCode: string;
  setName: string;
  oracleText: string;
  manaCost: string;
  image: string;
  colors: string;
  rarity: string;
  mapping: string;
  isFavorite?: boolean;
};

export type SmallMagicCard = {
  scryfallId: string;
  name: string;
};

export type Deck = {
  id: number;
  name: string;
  description: string;
  promoId: string;
  format: string;
  cardCount: number;
  viewCount: number;
  colors: string[];
  commanders: DeckCard[];
  mainboard: DeckCard[];
  sideboard: DeckCard[];
  isFavorite?: boolean;
  isLocked: boolean;
};

export type DeckCard = {
  card: MagicCard;
  quantity: number;
};

export type Structure = {
  Commanders: DeckCard[];
  Lands: DeckCard[];
  Creatures: DeckCard[];
  Sorceries: DeckCard[];
  Instants: DeckCard[];
  Artifacts: DeckCard[];
  Enchantments: DeckCard[];
  Planeswalkers: DeckCard[];
  Other: DeckCard[];
};

export type CardSet = {
  id: number;
  scryfallId: string;
  name: string;
  code: string;
  setType: string;
  iconSvgUri: string;
  cardCount: number;
  releasedAt: string;
};

export type SearchFilter = {
  cardName?: string;
  type?: string;
  manaValue?: string;
  power?: string;
  toughness?: string;
  loyalty?: string;
  rarity?: string;
  set?: string;
  format?: string;
  oracle?: string;
  unique?: string;
  is?: string;
  order?: string;
  colors: string[];
};

export type Match = {
  id: number;
  player0: MatchUser;
  player1: MatchUser;
  createdAt: number;
};

export type MatchUser = {
  id: number;
  name: string;
  deckSelected: boolean;
  canSelectDeck: boolean;
  playtest: Playtest;
};

export type MatchPlayer = {
  id: number;
  name: string;
  promoId: string;
  moxfieldId: string;
};

export type User = {
  id: number;
  username: string;
};

export type Playtest = {
  id: number;
  createdAt: number;
  createdAtString: string;
  match: Match;
  promoId: string;
  name: string;
  moxfieldId: string;
  allScryfallIds: string[];
};
