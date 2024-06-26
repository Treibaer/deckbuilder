export default class MagicHelper {
  static getDeckStructureFromCards(cards) {
    let commanders = cards.filter((card) => card.isCommander);
    cards = cards.filter((card) => !card.isCommander);
    let lands = cards.filter((card) => card.type.includes("Land"));
    let creatures = cards.filter((card) => card.type.includes("Creature"));
    let sorceries = cards.filter((card) => card.type.includes("Sorcery"));
    let instants = cards.filter((card) => card.type.includes("Instant"));
    let artifacts = cards.filter((card) => card.type.includes("Artifact"));
    let enchantments = cards.filter((card) =>
      card.type.includes("Enchantment")
    );
    let planeswalkers = cards.filter((card) =>
      card.type.includes("Planeswalker")
    );

    let remaingCards = cards.filter(
      (card) =>
        !card.type.includes("Land") &&
        !card.type.includes("Creature") &&
        !card.type.includes("Sorcery") &&
        !card.type.includes("Instant") &&
        !card.type.includes("Artifact") &&
        !card.type.includes("Enchantment") &&
        !card.type.includes("Planeswalker")
    );

    return {
      Commanders: commanders,
      Hide: commanders,
      Lands: lands,
      Creatures: creatures,
      Sorceries: sorceries,
      Instants: instants,
      Artifacts: artifacts,
      Enchantments: enchantments,
      Planeswalkers: planeswalkers,
      "": remaingCards,
    };
  }

  static loadFromTreibaer = true;

  static determineImageUrl(card, faceId = 0) {
    if (card.image_uris) {
      // if is scryfall card
      if (MagicHelper.loadFromTreibaer) {
        return "https://magic.treibaer.de/image/card/normal/" + card.id;
      }
      return card.image_uris.normal;
    } else if (card.image) {
      // if is treibaer card
      return card.image;
    } else if (card.card_faces) {
      // console.log(card.card_faces[faceId].image_uris.normal);
      return card.card_faces[faceId].image_uris.normal;
    } else {
      return backside;
    }
  }

  static determineCardType(card) {
    if (card.type_line.includes("Creature")) {
      return "Creature";
    } else if (card.type_line.includes("Land")) {
      return "Land";
    } else if (card.type_line.includes("Instant")) {
      return "Instant";
    } else if (card.type_line.includes("Sorcery")) {
      return "Sorcery";
    } else if (card.type_line.includes("Artifact")) {
      return "Artifact";
    } else if (card.type_line.includes("Enchantment")) {
      return "Enchantment";
    } else if (card.type_line.includes("Planeswalker")) {
      return "Planeswalker";
    } else {
      console.error("Unknown type: " + card.type_line+ ", scryfall_id: " + card.id);
      return "";
    }
  }
}
