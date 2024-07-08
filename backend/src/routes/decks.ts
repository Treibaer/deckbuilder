import express from "express";
import DeckService from "../DeckService.js";
import DataService from "../DataService.js";
import { Deck } from "../Models.js";

const dataService = new DataService();
const deckService = new DeckService();
const router = express.Router();

router.get("/", async (_, res) => {
  const decks = dataService.loadDecks();
  res.status(200).json(decks);
});


router.post("/api/decks", (req, res) => {
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

export default router;
