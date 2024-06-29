import { useLoaderData } from "react-router-dom";
import MagicCardList from "./MagicCardList.jsx";
import "./MagicSetCardList.css";

export default function MagicSetCardList() {
  const data = useLoaderData();
  const cards = data.data;

  return (
    <>
      <h1>{cards[0]?.set_name}</h1>
      {<MagicCardList cards={cards} />}
    </>
  );
}

export const loader = async ({ params }) => {
  let url = `https://api.scryfall.com/cards/search?include_extras=true&include_variations=true&order=set&q=e%3A${params.setCode}&unique=prints`;
  return await fetch(url);
};
