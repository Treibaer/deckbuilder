const backside = "https://magic.treibaer.de/image/card/backside.jpg";

export default class MagicHelper {
  static getDeckStructureFromCards(cards) {
    let commanders = cards.filter((card) => card.isCommander);
    cards = cards.filter((card) => !card.isCommander);
    // add type is missing to cards
    cards = cards.map((card) => {
      if (!card.type) {
        card.type = "Unknown";
        console.error("Card has no type: " + card.name + ", id: " + card.id);
      }
      return card;
    });
    let lands = cards
      .filter((card) => card.type.includes("Land"))
      .sort((a, b) => a.name.localeCompare(b.name));
    let creatures = cards
      .filter((card) => card.type.includes("Creature"))
      .sort((a, b) => a.name.localeCompare(b.name));
    let sorceries = cards
      .filter((card) => card.type.includes("Sorcery"))
      .sort((a, b) => a.name.localeCompare(b.name));
    let instants = cards
      .filter((card) => card.type.includes("Instant"))
      .sort((a, b) => a.name.localeCompare(b.name));
    let artifacts = cards
      .filter((card) => card.type.includes("Artifact"))
      .sort((a, b) => a.name.localeCompare(b.name));
    let enchantments = cards
      .filter((card) => card.type.includes("Enchantment"))
      .sort((a, b) => a.name.localeCompare(b.name));
    let planeswalkers = cards
      .filter((card) => card.type.includes("Planeswalker"))
      .sort((a, b) => a.name.localeCompare(b.name));

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

  static determineImageUrl(card, faceId = 0) {
    // todo: make more generic
    // if (card.isMoxy) {
    //   return card.image;
    // }
    if (card.image_uris) {
      // proxying is allowed per api guidelines
      return `https://magic.treibaer.de/image/card/normal/${card.id}`;
      return card.image_uris.normal;
    } else if (card.card_faces) {
      if (card.card_faces[faceId].image_uris) {
        return card.card_faces[faceId].image_uris.normal;
      }
      return card.card_faces[faceId].image;
    } else if (card.image) {
      return card.image;
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
      console.error(
        "Unknown type: " + card.type_line + ", scryfall_id: " + card.id
      );
      return "";
    }
  }

  static artCropUrl(scryfallId) {
    return "https://magic.treibaer.de/image/card/art_crop/" + scryfallId;
  }

  static getImageUrl(scryfallId, type = "normal", faceSide = 0) {
    // proxying is allowed per api guidelines
    return `https://magic.treibaer.de/image/card/${type}/${scryfallId}${
      faceSide > 0 ? "?faceSide=1" : ""
    }`;

    let firstChar = scryfallId.charAt(0);
    let secondChar = scryfallId.charAt(1);
    return `https://cards.scryfall.io/${type}/front/${firstChar}/${secondChar}/${scryfallId}.jpg?1562908368`;
  }
  static getCardFace(scryfallId, faceId = 0) {
    // not implemented yet, will be done in backend, when importing the moxfield deck
    return "https://magic.treibaer.de/image/card/backside.jpg";
  }
}
