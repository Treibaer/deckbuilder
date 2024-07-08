import express from "express";
import MatchService from "../MatchService.js";

const matchService = new MatchService();

const router = express.Router();

router.get("/", async (_, res) => {
  const matches = await matchService.loadMatches();
  res.status(200).json(matches);
});

router.post("/", async (req, res) => {
  const matches = await matchService.loadMatches();
  res.status(200).json(matches);
});

export default router;
