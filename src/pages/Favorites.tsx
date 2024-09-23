import { LoaderFunction, useLoaderData } from "react-router-dom";
import DecksList from "../components/Decks/DecksList";
import { Deck } from "../models/dtos";
import Client from "../Services/Client";
import MagicHelper from "../Services/MagicHelper";

const Favorites = () => {
  const data = useLoaderData() as Deck[];
  
  data.forEach((deck: any) => {
    deck.img = MagicHelper.artCropUrl(deck.promoId);
    deck.link = `/decks/moxfield/${deck.id}`;
  } );
  return (
    <div className="mx-auto">
      <h1 className="flex justify-center mb-8">Favorites</h1>
      <div className="flex gap-4">
        <DecksList decks={data} />
      </div>
    </div>
  );
};

export default Favorites;

export const loader: LoaderFunction = async () => {
  return await Client.shared.get("/favorites", true);
};
