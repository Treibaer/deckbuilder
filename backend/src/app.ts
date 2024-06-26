import express from "express";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

// CORS

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.get("/", (_, res) => {
  // res.send("Hello from express");
  res.status(200).json({ message: "Hello from express" });
});

app.get("/api/decks", (_, res) => {
  const decks = loadDecks();
  // saveDecks(decks);
  res.status(200).json(decks);
});

app.put("/api/decks/:id/cards/:cardId", (req, res) => {
  const deckId = parseInt(req.params.id);
  const cardId = req.params.cardId;
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) {
    res.status(404).json({ message: "Deck not found" });
    return;
  }
  const cardIndex = deck.mainboard.findIndex((c) => c.scryfallId === cardId);

  if (cardIndex === -1) {
    res.status(404).json({ message: "Card not found" });
    return;
  }
  deck.mainboard[cardIndex].amount = deck.mainboard[cardIndex].amount - 1;
  if (deck.mainboard[cardIndex].amount === 0) {
    deck.mainboard.splice(cardIndex, 1);
  }
  saveDecks(decks);
  res.status(200).json({ message: "Card updated" });
}


// create card
app.post("/api/decks", (req, res) => {
  const deck: Deck = req.body;
  // validate deck
  if (!deck.name || !deck.description || !deck.mainboard) {
    res.status(400).json({ message: "Invalid deck" });
    return;
  }

  const decks = loadDecks();

  let existingDeck = decks.find((d) => d.id === deck.id);
  let maxId = 0;
  if (decks.length > 0) {
    maxId = Math.max(...decks.map((d) => d.id));
  }
  if (existingDeck) {
    existingDeck.name = deck.name;
    existingDeck.description = deck.description;
    existingDeck.mainboard = deck.mainboard;
  } else {
    deck.id = maxId + 1;
    decks.push(deck);
  }
  saveDecks(decks);
  res.status(200).json(deck);
});

app.get("/api/decks/:id", (req, res) => {
  const deckId = parseInt(req.params.id);
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) {
    res.status(404).json({ message: "Deck not found" });
    return;
  }
  res.status(200).json(deck);
});

app.post("/api/decks/:id/cards", (req, res) => {
  const deckId = parseInt(req.params.id);
  const card: Card = req.body;
  // validate card
  if (!card.id) {
    res.status(400).json({ message: "Invalid card" });
    return;
  }

  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) {
    res.status(404).json({ message: "Deck not found" });
    return;
  }

  let existingCard = deck.mainboard.find((c) => c.scryfallId === card.id);
  let maxId = 0;
  if (deck.mainboard.length > 0) {
    maxId = Math.max(...deck.mainboard.map((c) => c.id));
  }
  if (existingCard) {
    existingCard.amount = existingCard.amount + 1;
    console.log(existingCard);
  } else {
    deck.mainboard.push({
      id: maxId + 1,
      scryfallId: card.id,
      card: card,
      amount: 1,
    });
  }
  // console.log(decks);
  // return;
  saveDecks(decks);
  res.status(200).json(card);
});

app.delete("/api/decks/:id/cards/:cardId", (req, res) => {
  const deckId = parseInt(req.params.id);
  const cardId = req.params.cardId;
  const decks = loadDecks();
  const deck = decks.find((d) => d.id === deckId);
  if (!deck) {
    res.status(404).json({ message: "Deck not found" });
    return;
  }
  const cardIndex = deck.mainboard.findIndex((c) => c.scryfallId === cardId);

  if (cardIndex === -1) {
    res.status(404).json({ message: "Card not found" });
    return;
  }
  deck.mainboard.splice(cardIndex, 1);
  saveDecks(decks);
  res.status(200).json({ message: "Card deleted" });
});

app.delete("/api/decks/:id", (req, res) => {
  const deckId = parseInt(req.params.id);
  const decks = loadDecks();
  const deckIndex = decks.findIndex((d) => d.id === deckId);
  if (deckIndex === -1) {
    res.status(404).json({ message: "Deck not found" });
    return;
  }
  decks.splice(deckIndex, 1);
  saveDecks(decks);
  res.status(200).json({ message: "Deck deleted" });
});

const port = 3456;
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});

function loadDecks(): Deck[] {
  if (!fs.existsSync("data/decks.json")) {
    return [];
  }
  const decks = fs.readFileSync("data/decks.json", "utf-8");
  return JSON.parse(decks);
}

function saveDecks(decks: Deck[]): void {
  fs.writeFileSync("data/decks.json", JSON.stringify(decks, null, 2));
}

interface Deck {
  id: number;
  name: string;
  description: string;
  mainboard: Card[];
}

// scryfall card
interface Card {
  id: number;
  scryfallId: string;
  card: number;
}
