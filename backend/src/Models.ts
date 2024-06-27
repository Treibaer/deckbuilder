export interface Deck {
  id: number;
  name: string;
  description: string;
  mainboard: Card[];
  promoId: string;
  isPublic: boolean
}

export interface Card {
  id: number;
  scryfallId: string;
  card: ScryfallCard;
  amount: number;
}

export interface ScryfallCard {
  id: string;
  name: string;
  type_line: string;
  oracle_text: string;
  mana_cost: string;
  cmc: number;
  colors: string[];
  color_identity: string[];
  set: string;
  rarity: string;
  image_uris: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  prices: {
    usd: string;
    usd_foil: string;
    eur: string;
    tix: string;
  };
}
