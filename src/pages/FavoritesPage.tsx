import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import CardPeekView from "../components/Card/CardPeekView";
import DecksListWrapper from "../components/Deck/DecksListWrapper";
import MagicCardView from "../components/MagicCardView";
import { FavoritesDto, MagicCard } from "../models/dtos";
import { CardSize } from "../models/structure";
import Client from "../Services/Client";

const FavoritesPage = () => {
  const loaderData = useLoaderData() as FavoritesDto;

  const [favoriteDecks, setFavoriteDecks] = useState(loaderData.moxfieldDecks);
  const [favoriteCards, setFavoriteCards] = useState(loaderData.cards);
  const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);

  async function refresh() {
    const favorites = await Client.shared.get<FavoritesDto>("/favorites", true);
    setFavoriteDecks(favorites.moxfieldDecks);
    setFavoriteCards(favorites.cards);
  }

  return (
    <div className="mx-auto">
      {selectedCard && (
        <CardPeekView
          card={selectedCard}
          onClose={() => setSelectedCard(null)}
          updateFavorite={refresh}
        />
      )}
      <div className="flex justify-center text-3xl font-semibold m-2 mb-8">
        Favorite Decks
      </div>
      <div className="flex gap-4">
        <DecksListWrapper decks={favoriteDecks} type="moxfield" />
      </div>
      <div className="flex justify-center text-3xl font-semibold m-2 mt-8 mb-8">
        Favorite Cards
      </div>
      <div className="flex flex-wrap gap-4 justify-center">
        {favoriteCards.map((card) => (
          <div key={card.scryfallId} className="cursor-pointer">
            <MagicCardView
              card={card}
              size={CardSize.normal}
              onTap={() => setSelectedCard(card)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;

export const loader: LoaderFunction = async () => {
  return await Client.shared.get("/favorites", true);
};