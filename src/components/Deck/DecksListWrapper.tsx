import { NavLink } from "react-router-dom";
import Helper from "../../Services/Helper";
import cardStackImage from "../../assets/cardstack.svg";
import viewsImage from "../../assets/views.svg";
import MagicHelper from "../../Services/MagicHelper";

const DecksListWrapper: React.FC<{ decks: any[], type: "moxfield" | "custom" }> = ({ decks, type }) => {
  for (const deck of decks) {
    if (!deck.img) {
      deck.img = deck.promoId
        ? MagicHelper.artCropUrl(deck.promoId)
        : undefined;
    }
    if (type === "moxfield") {
      deck.link = `/decks/moxfield/${deck.id}`;
    } else {
      deck.link = `/decks/my/${deck.id}`;
    }
  }
  return (
    <div className="">
      <div className="flex flex-wrap gap-2 justify-center text-sm md:text-base">
        {decks.map((deck) => (
          <NavLink
            to={deck.link}
            key={deck.id}
            className="relative border border-black rounded-xl"
          >
            <div className="relative w-[180px] md:w-[260px] md:h-[198px]">
              {deck.img && (
                <img
                  src={deck.img}
                  className="opacity-80 w-full h-full rounded-xl  object-cover"
                  alt="Loading Promo..."
                />
              )}
              <div className="tb-inner-shadow absolute top-0 left-0 w-full h-full shadow-2xl rounded-xl"></div>
            </div>
            <div className="absolute bottom-[28px] left-1 w-3/5 text-ellipsis overflow-x-hidden text-nowrap">
              {deck.format}
            </div>
            <div className="absolute top-1 left-1" title={deck.name}>
              {deck.name}
            </div>

            {deck.colors.length > 0 && (
              <div className="absolute bottom-1 flex">
                {deck.colors.map((color: string) =>
                  Helper.replaceColorSymbolsByImage(color)
                )}
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-1 absolute right-2 bottom-1 text-sm">
              {deck.viewCount !== undefined && deck.viewCount > 0 && (
                <div className="flex justify-end">
                  <img src={viewsImage} className="w-5" alt="Views" />
                  <div>{deck.viewCount}</div>
                </div>
              )}
              <div className="flex justify-end">
                <img src={cardStackImage} className="w-5" alt="Card Stack" />
                <div>{deck.cardCount}</div>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default DecksListWrapper;
