import { useEffect, useState } from "react";
import Client from "../../Services/Client";
import "./MoxfieldDeckOverview.css";
import DeckList from "./DeckOverview";
import { useLoaderData } from "react-router-dom";
import MagicHelper from "../../Services/MagicHelper";

const client = Client.shared;

export default function MoxfieldDeckOverview() {
  const decks = useLoaderData();
  
  const mappedDecks = decks.map((deck) => {
    return {
      id: deck.id,
      img: deck.promoId ? MagicHelper.artCropUrl(deck.promoId) : undefined,
      link: `/decks/moxfield/${deck.publicId}`,
      name: deck.name,
      format: deck.format,
      viewCount: deck.viewCount,
      cardCount: deck.mainboardCount,
      colors: deck.colors,
    };
  });

  return (
    <div>
      <h1>Moxfield Decks</h1>
      <DeckList decks={mappedDecks} />
    </div>
  );
}

export const loader = async () => {
  const response = await client.getDecks();
  return response;
};