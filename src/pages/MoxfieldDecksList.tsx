import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import MagicHelper from "../Services/MagicHelper";
import MoxfieldService from "../Services/MoxfieldService";
import DeckList from "../components/Decks/DecksList";
import "./MoxfieldDecksList.css";
import { Deck } from "./deck";

const moxfieldService = MoxfieldService.shared;

const MoxfieldDecksList = () => {
  const data = useLoaderData() as any;
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  // const q = searchParams.get("q");
  const format = searchParams.get("format") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const id = searchParams.get("id") ?? "";
  const zone = searchParams.get("zone") ?? "";
  // todo: check if this is needed
  const selectedPage = page ? page - 1 : 0;

  const mappedDecks = data.decks.map((deck: Deck) => {
    return {
      id: deck.id,
      img: deck.promoId ? MagicHelper.artCropUrl(deck.promoId) : undefined,
      link: `/decks/moxfield/${deck.id}`,
      name: deck.name,
      format: deck.format,
      viewCount: deck.viewCount,
      cardCount: deck.cardCount,
      colors: deck.colors,
    };
  });

  function switchFormat(newFormat: string) {
    newFormat = newFormat === "All" ? "" : newFormat;
    let url = `?id=${id}&format=${newFormat}&page=1`;
    if (zone === "commander") {
      url += "&commander";
    }
    navigate(url);
  }

  function switchZone(newZone: string) {
    let url = `?id=${id}&format=${format}&page=1`;
    if (newZone === "commander") {
      url += "&commander";
    }
    navigate(url);
  }

  return (
    <div>
      <div className="headline">
        {!data.referenceCard && <h1>Moxfield Decks</h1>}
        {data.referenceCard && (
          <h1>
            Moxfield Decks for{" "}
            <Link to={"/cards/" + data.referenceCard.scryfallId}>
              {data.referenceCard?.name}
            </Link>
          </h1>
        )}
        <select
          defaultValue={format}
          onChange={(event) => {
            switchFormat(event.target.value);
          }}
        >
          {["All", "modern", "commander", "commanderPrecons", "standard"].map(
            (format) => {
              return (
                <option value={format} key={format}>
                  {format}
                </option>
              );
            }
          )}
        </select>
        {data.referenceCard && (
          <select
            defaultValue={format}
            onChange={(event) => {
              switchZone(event.target.value);
            }}
          >
            {["mainboard", "commander"].map((zone) => {
              return (
                <option value={zone} key={zone}>
                  {zone}
                </option>
              );
            })}
          </select>
        )}
        <div>
          Showing {data.decks.length} of {data.totalResults} decks{" "}
        </div>
      </div>
      {data.totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: Math.min(20, data.totalPages) }, (_, i) => (
            <Link to={`?id=${id}&format=${format}&page=${i + 1}`} key={i}>
              <button
                className={
                  selectedPage === i ? "active tb-button" : "tb-button"
                }
              >
                {i + 1}
              </button>
            </Link>
          ))}
        </div>
      )}

      <DeckList decks={mappedDecks} />
    </div>
  );
};

export default MoxfieldDecksList;

export const loader = async ({ request }: any) => {
  const queryParameters = new URL(request.url).searchParams;
  let id = queryParameters.get("id") ?? "";
  let page = Number(queryParameters.get("page") ?? "1");
  const format = queryParameters.get("format") ?? "";
  const commander = queryParameters.get("commander");

  if (id) {
    return await moxfieldService.getDecksByCardId(
      id,
      format,
      page,
      commander !== null
    );
  }
  return await moxfieldService.getDecks(format, page, commander !== null);
};
