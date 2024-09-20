import { NavLink } from "react-router-dom";
import Helper from "../../Services/Helper";
import cardStackImage from "../../assets/cardstack.svg";
import viewsImage from "../../assets/views.svg";

const DecksList: React.FC<{ decks: any[] }> = ({ decks }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {decks.map((deck) => (
        <NavLink to={deck.link} key={deck.id} className="relative border border-black rounded-xl">
          <div className="relative w-[260px] h-[198px]">
            {deck.img && (
              <img
                src={deck.img}
                className="opacity-80 w-full h-full rounded-xl  object-cover"
                alt="Loading Promo..."
              />
            )}
            <div className="tb-inner-shadow absolute top-0 left-0 w-full h-full shadow-2xl rounded-xl"></div>
          </div>
          <div className="absolute top-[140px] left-1">{deck.format}</div>
          <div className="absolute top-1 left-1 text-base" title={deck.name}>
            {deck.name}
          </div>

          {deck.colors.length > 0 && (
            <div className="absolute top-[172px] flex">
              {deck.colors.map((color: string) =>
                Helper.replaceColorSymbolsByImage(color)
              )}
            </div>
          )}

          <div className="flex gap-1 absolute right-2 top-[176px] text-sm">
            {deck.viewCount !== undefined && deck.viewCount > 0 && (
              <div className="flex">
                <img src={viewsImage} className="w-5" alt="Views" />
                <div>{deck.viewCount}</div>
              </div>
            )}
            <div className="flex">
              <img src={cardStackImage} className="w-5" alt="Card Stack" />
              <div>{deck.cardCount}</div>
            </div>
          </div>
        </NavLink>
      ))}
    </div>
  );
};

export default DecksList;
