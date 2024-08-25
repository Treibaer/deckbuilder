import { Link } from "react-router-dom";
import Helper from "../../Services/Helper";
import cardStackImage from "../../assets/cardstack.svg";
import viewsImage from "../../assets/views.svg";
import "./DecksList.css";

const DecksList: React.FC<{ decks: any[] }> = ({ decks }) => {
  return (
    <div className="deckList">
      {decks.map((deck) => (
        <Link to={deck.link} key={deck.id}>
          <div className="promoWrapper">
            {deck.img && <img src={deck.img} alt="Loading Promo..." />}
            <div className="overlay"></div>
          </div>
          <div className="format">{deck.format}</div>

          <div className="deck-title" title={deck.name}>
            {deck.name}
          </div>

          {deck.colors.length > 0 && (
            <div className="colors">
              {deck.colors.map((color: string) =>
                Helper.replaceColorSymbolsByImage(color)
              )}
            </div>
          )}

          <div className="statistics">
            {deck.viewCount !== undefined && deck.viewCount > 0 && (
              <div>
                <img src={viewsImage} alt="Views" />
                <div>{deck.viewCount}</div>
              </div>
            )}

            <div>
              <img src={cardStackImage} alt="Card Stack" />
              <div>{deck.cardCount}</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DecksList;
