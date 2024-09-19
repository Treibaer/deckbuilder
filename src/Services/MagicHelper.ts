import { DeckCard, MagicCard, SearchFilter, Structure } from "../models/dtos";
import Constants from "./Constants";

// const backside = `${Constants.backendUrl}/image/card/backside.jpg`;

export default class MagicHelper {
  static getDeckStructureFromCards(cards: DeckCard[]): Structure {
    // MagicHelper.determineCardType(newCard)
    // todo: multiple zones are possible with this logic -> fix
    let lands = cards
      .filter((card) => card.card.typeLine.includes("Land"))
      .sort((a, b) => a.card.name.localeCompare(b.card.name));
    let creatures = cards
      .filter((card) => card.card.typeLine.includes("Creature"))
      .sort((a, b) => a.card.name.localeCompare(b.card.name));
    let sorceries = cards
      .filter((card) => card.card.typeLine.includes("Sorcery"))
      .sort((a, b) => a.card.name.localeCompare(b.card.name));
    let instants = cards
      .filter((card) => card.card.typeLine.includes("Instant"))
      .sort((a, b) => a.card.name.localeCompare(b.card.name));
    let artifacts = cards
      .filter((card) => card.card.typeLine.includes("Artifact") && !card.card.typeLine.includes("Creature"))
      .sort((a, b) => a.card.name.localeCompare(b.card.name));
    let enchantments = cards
      .filter((card) => card.card.typeLine.includes("Enchantment"))
      .sort((a, b) => a.card.name.localeCompare(b.card.name));
    let planeswalkers = cards
      .filter((card) => card.card.typeLine.includes("Planeswalker"))
      .sort((a, b) => a.card.name.localeCompare(b.card.name));

    let remaingCards = cards.filter(
      (card) =>
        !card.card.typeLine.includes("Land") &&
        !card.card.typeLine.includes("Creature") &&
        !card.card.typeLine.includes("Sorcery") &&
        !card.card.typeLine.includes("Instant") &&
        !card.card.typeLine.includes("Artifact") &&
        !card.card.typeLine.includes("Enchantment") &&
        !card.card.typeLine.includes("Planeswalker")
    );

    return {
      Commanders: [],
      Lands: lands,
      Creatures: creatures,
      Sorceries: sorceries,
      Instants: instants,
      Artifacts: artifacts,
      Enchantments: enchantments,
      Planeswalkers: planeswalkers,
      Other: remaingCards,
    };
  }

  static determineImageUrl(card: MagicCard, faceId = 0) {
    // proxying is allowed per api guidelines
    return `${Constants.newBackendUrl}/image/card/normal/${card.scryfallId}?faceSide=${faceId}`;
  }

  static determineCardType(card: MagicCard) {
    if (!card.typeLine) {
      return "Unknown";
    } else if (card.typeLine.includes("Creature")) {
      return "Creature";
    } else if (card.typeLine.includes("Land")) {
      return "Land";
    } else if (card.typeLine.includes("Instant")) {
      return "Instant";
    } else if (card.typeLine.includes("Sorcery")) {
      return "Sorcery";
    } else if (card.typeLine.includes("Artifact")) {
      return "Artifact";
    } else if (card.typeLine.includes("Enchantment")) {
      return "Enchantment";
    } else if (card.typeLine.includes("Planeswalker")) {
      return "Planeswalker";
    } else {
      console.error(
        "Unknown type: " + card.typeLine + ", scryfall_id: " + card.scryfallId
      );
      return "";
    }
  }

  static artCropUrl(scryfallId: string) {
    return `${Constants.backendUrl}/image/card/art_crop/${scryfallId}`;
  }

  static getImageUrl(scryfallId: string, type = "normal", faceSide = 0) {
    // proxying is allowed per api guidelines
    return `${Constants.backendUrl}/image/card/${type}/${scryfallId}${
      faceSide > 0 ? "?faceSide=1" : ""
    }`;
  }

  static extractFilterFromQuery(q: string) {
    // example: order:name direction:ascending o:oracle e:ymid t:Creature c<=wu id<=rg m=2 mv=1 power=3 toughness>4 loyalty=5
    // example: order:name direction:ascending o:oracle e:ymid type:Creature c<=wu id<=rg m=2 mv=1 power=3 toughness>4 loyalty=5
    const filter: SearchFilter = {
      cardName: undefined,
      type: undefined,
      manaValue: undefined,
      power: undefined,
      toughness: undefined,
      loyalty: undefined,
      rarity: undefined,
      set: undefined,
      format: undefined,
      oracle: undefined,
      unique: undefined,
      is: undefined,
      colors: [],
    };

    if (!q) {
      return filter;
    }

    const split = q.trim().split(" ");
    if (split.length === 1 && !MagicHelper.extractOperator(split[0])) {
      filter.cardName = split[0];
      return filter;
    }

    split.reverse().forEach((part) => {
      const operator = MagicHelper.extractOperator(part);
      if (!operator) {
        filter.cardName = part;
        return;
      }
      const [key, value] = part.split(operator);
      switch (key) {
        case "name":
          filter.cardName = value;
          break;
        case "type":
          filter.type = value;
          break;
        case "color":
          for (let i = 0; i < value.length; i++) {
            const color = value.charAt(i);
            filter.colors.push(color);
          }
          break;
        case "mv":
          filter.manaValue = value;
          break;
        case "power":
          filter.power = value;
          break;
        case "toughness":
          filter.toughness = value;
          break;
        case "rarity":
          filter.rarity = value;
          break;
        case "format":
          filter.format = value;
          break;
        case "oracle":
          filter.oracle = value;
          break;
        // case "loyalty":
        //   filter.loyalty = value;
        //   break;
        case "set":
          filter.set = value;
          break;
        case "unique":
          filter.unique = value;
          break;
        case "is":
          filter.is = value;
          break;
        default:
          break;
      }
    });
    return filter;
  }

  static createUrlFromFilter(filter: SearchFilter) {
    let query = "";
    if (filter.cardName) {
      query += ` name:${filter.cardName}`;
    }
    if (filter.type) {
      query += ` type:${filter.type}`;
    }
    if (filter.manaValue) {
      query += ` mv:${filter.manaValue}`;
    }

    if (filter.rarity) {
      query += ` rarity:${filter.rarity}`;
    }

    if (filter.power) {
      query += ` power:${filter.power}`;
    }
    if (filter.toughness) {
      query += ` toughness:${filter.toughness}`;
    }
    if (filter.loyalty) {
      query += ` loyalty:${filter.loyalty}`;
    }
    if (filter.set) {
      query += ` set:${filter.set}`;
    }
    if (filter.format) {
      query += ` format:${filter.format}`;
    }
    if (filter.oracle) {
      query += ` oracle:${filter.oracle}`;
    }
    if (filter.colors && filter.colors.length > 0) {
      query += ` color:${filter.colors.join("")}`;
    }
    if (filter.unique) {
      query += ` unique:${filter.unique}`;
    }
    if (filter.is) {
      query += ` is:fullart`;
    }
    if (filter.order) {
      query += ` order:${filter.order}`;
    }
    query = query.trim().toLowerCase();
    return `/search?q=${query}`;
  }

  static extractOperator(value: string) {
    const operators = ["<=", "<", "=", ">", ">=", ":"];
    for (let operator of operators) {
      if (value.includes(operator)) {
        return operator;
      }
    }
    return undefined;
  }
}
