import { useState } from "react";
import { LoaderFunction, useLoaderData } from "react-router-dom";
import CardPeekView from "../components/CardPeekView";
import DecksList from "../components/Decks/DecksList";
import MagicCardView from "../components/MagicCardView";
import { Deck, MagicCard } from "../models/dtos";
import { CardSize } from "../models/structure";
import Client from "../Services/Client";
import MagicHelper from "../Services/MagicHelper";

type FavoritesDto = {
  moxfieldDecks: Deck[];
  cards: MagicCard[];
};

const Favorites = () => {
  const loaderData = useLoaderData() as FavoritesDto;

  const [favoriteDecks, setFavoriteDecks] = useState(loaderData.moxfieldDecks);
  const [favoriteCards, setFavoriteCards] = useState(loaderData.cards);
  const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);

  async function refresh() {
    const favorites = await Client.shared.get<FavoritesDto>("/favorites", true);
    setFavoriteDecks(favorites.moxfieldDecks);
    setFavoriteCards(favorites.cards);
  }

  const moxfieldDecks = favoriteDecks.map((deck: any) => {
    return {
      ...deck,
      img: MagicHelper.artCropUrl(deck.promoId),
      link: `/decks/moxfield/${deck.id}`,
    };
  });

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
        <DecksList decks={moxfieldDecks} />
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

export default Favorites;

export const loader: LoaderFunction = async () => {
  return await Client.shared.get("/favorites", true);
};
