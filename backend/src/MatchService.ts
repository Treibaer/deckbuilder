export default class MatchService {
  async loadMatches() {
    return exampleData.data;
  }
}
const exampleData = {
  data: [
    {
      id: 1,
      players: [
        {
          id: 1,
          name: "Hannes",
          deck: "Gruul Aggro",
          gameStateId: 12345,
          deckId: 1,
        },
        {
          id: 2,
          name: "Juri",
          deck: "Dimir Control",
          gameStateId: 12346,
          deckId: 2,
        }
      ],
      creationDate: "2021-01-01",
      // player0: "Hannes",
      // player1: "Juri",
      // deckId0: 1, // not important
      // deckId1: 2, // not important
      // gameStateId0: 3,
      // gameStateId1: 4,
    },
    {
      id: 2,
      players: [
        {
          id: 1,
          name: "Alice",
          deck: "Gruul Aggro",
          gameStateId: 12347,
        },
        {
          id: 2,
          name: "Bob",
          deck: "Dimir Control",
          gameStateId: 12348,
        }
      ],
      creationDate: "2021-01-02",
    },
  ],
};
const exampleData1 = {
  data: [
    {
      id: 1,
      player0: "Hannes",
      player1: "Juri",
      player0Deck: "Gruul Aggro",
      player1Deck: "Dimir Control",
      gameStateId0: 12345,
      gameStateId1: 12346,
    },
    {
      id: 2,
      player1: "Alice",
      player2: "Bob",
      winner: "Bob",
      date: "2021-01-02",
      notes: "Bob won with a control deck",
    },
  ],
};
