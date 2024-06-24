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
}
