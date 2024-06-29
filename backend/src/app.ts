import bodyParser from "body-parser";
import express from "express";
import DataService from "./DataService.js";
import DeckService from "./DeckService.js";
import { Deck, ScryfallCard } from "./Models.js";

const app = express();
const dataService = new DataService();
const deckService = new DeckService();
app.use(bodyParser.json());

// CORS
app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // allow all domains
  res.setHeader("Access-Control-Allow-Methods", "GET, PUT, DELETE, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  next();
});

app.get("/", (_, res) => {
  res.status(200).json({ message: "Hello from express" });
});

app.get("/api/decks", async (_, res) => {
  const decks = dataService.loadDecks();
  // wait 2 seconds
  // await new Promise((resolve) => setTimeout(resolve, 2000));
  res.status(200).json(decks);
});

// currently only reduce amount by one or set promoId
app.put("/api/decks/:id/cards/:cardId", (req, res) => {
  const deckId = parseInt(req.params.id);
  const cardId = req.params.cardId;
  try {
    deckService.decreaseCardAmount(deckId, cardId);
    res.status(200).json({ message: "Card updated" });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

app.post("/api/decks", (req, res) => {
  const rawDeck = req.body;

  if (!rawDeck.name || !rawDeck.description) {
    res.status(400).json({ message: "Invalid deck" });
    return;
  }

  const deck: Deck = {
    id: rawDeck.id,
    name: rawDeck.name,
    description: rawDeck.description,
    mainboard: [],
    promoId: rawDeck.promoId,
    isPublic: false,
  };

  deckService.createOrUpdateDeck(deck);
  res.status(200).json(deck);
});

// currently only replace print
app.put("/api/decks/:id", (req, res) => {
  const deckId = parseInt(req.params.id);
  const oldId = req.body.oldId;
  const newCard = req.body.newCard;
  
  try {
    deckService.replaceCard(deckId, oldId, newCard);
    res.status(200).json({ message: "Card replaced" });
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

app.get("/api/decks/:id", (req, res) => {
  const deckId = parseInt(req.params.id);

  const deck = deckService.getDeck(deckId);
  if (!deck) {
    res.status(404).json({ message: "Deck not found" });
    return;
  }
  res.status(200).json(deck);
});

app.post("/api/decks/:id/cards", (req, res) => {
  const deckId = parseInt(req.params.id);
  const card: ScryfallCard = req.body;

  try {
    deckService.addCardToDeck(deckId, card);
    res.status(200).json(card);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
});

app.delete("/api/decks/:id/cards/:cardId", (req, res) => {
  const deckId = parseInt(req.params.id);
  const cardId = req.params.cardId;
  const decks = dataService.loadDecks();
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
  dataService.saveDecks(decks);
  res.status(200).json({ message: "Card deleted" });
});

app.delete("/api/decks/:id", (req, res) => {
  const deckId = parseInt(req.params.id);
  const decks = dataService.loadDecks();
  const deckIndex = decks.findIndex((d) => d.id === deckId);
  if (deckIndex === -1) {
    res.status(404).json({ message: "Deck not found" });
    return;
  }
  decks.splice(deckIndex, 1);
  dataService.saveDecks(decks);
  res.status(200).json({ message: "Deck deleted" });
});

const port = 3456;
app.listen(port, () => {
  console.log("Server is running on http://localhost:" + port);
});
