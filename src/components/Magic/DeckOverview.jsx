import { Link } from "react-router-dom";
import "./DeckOverview.css";
import Helper from "./Helper";

export default function DeckOverview({ decks }) {
  return (
    <div className="deckList">
      {decks.map((deck) => (
        <Link to={deck.link} key={deck.id}>
          <div className="promoWrapper">
            {deck.img && <img src={deck.img} alt="Loading Promo..." />}
          </div>
          <div className="deck-title" title={deck.name}>
            {deck.name}
          </div>
          <div className="deckInfo">
            {deck.description && <p>{deck.description}</p>}
            <p>Format: {deck.format}</p>
            {deck.viewCount !== undefined && <p>ViewCount: {deck.viewCount}</p>}
            <p>Cards: {deck.cardCount}</p>

            {deck.colors.length > 0 && (
              <div className="colors">
                {deck.colors.map((color) =>
                  Helper.replaceColorSymbolsByImage(color)
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}