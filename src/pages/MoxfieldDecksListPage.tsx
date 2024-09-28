import {
  NavLink,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import MoxfieldService from "../Services/MoxfieldService";
import Button from "../components/Button";
import DeckList from "../components/Deck/DecksListWrapper";
import { Deck } from "../models/dtos";
import Select from "../components/Select";

const moxfieldService = MoxfieldService.shared;

const MoxfieldDecksListPage = () => {
  const data = useLoaderData() as any;
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  // const q = searchParams.get("q");
  const format = searchParams.get("format") ?? "";
  const sortType = searchParams.get("sortType") ?? "";
  const page = Number(searchParams.get("page") ?? "1");
  const id = searchParams.get("id") ?? "";
  const zone = searchParams.get("zone") ?? "mainboard";
  // todo: check if this is needed
  const selectedPage = page ? page - 1 : 0;

  const mappedDecks = data.decks.map((deck: Deck) => {
    return {
      id: deck.id,
      promoId: deck.promoId,
      name: deck.name,
      format: deck.format,
      viewCount: deck.viewCount,
      cardCount: deck.cardCount,
      colors: deck.colors,
    };
  });

  function switchFormat(newFormat: string) {
    newFormat = newFormat === "All" ? "" : newFormat;
    let url = `?id=${id}&format=${newFormat}&page=1&sortType=${sortType}&zone=${zone}`;
    navigate(url);
  }

  function switchSortType(newSortType: string) {
    let url = `?id=${id}&format=${format}&page=1&sortType=${newSortType}&zone=${zone}`;
    navigate(url);
  }

  function switchZone(newZone: string) {
    let url = `?id=${id}&format=${format}&page=1&sortType=${sortType}&zone=${newZone}`;
    navigate(url);
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 select-none">
        {!data.referenceCard && (
          <div className="text-3xl font-semibold">Moxfield Decks</div>
        )}
        {data.referenceCard && (
          <div className="text-xl">
            Moxfield Decks for{" "}
            <NavLink to={"/cards/" + data.referenceCard.scryfallId}>
              <div className="text-brightBlue">{data.referenceCard?.name}</div>
            </NavLink>
          </div>
        )}
        <div className="flex gap-2">
          <Select
            defaultValue={format}
            onChange={(event) => {
              switchFormat(event.target.value);
            }}
          >
            {[
              "All",
              "modern",
              "commander",
              "commanderPrecons",
              "precons",
              "standard",
            ].map((format) => {
              return (
                <option value={format} key={format}>
                  {format}
                </option>
              );
            })}
          </Select>
          <Select
            defaultValue={sortType}
            onChange={(event) => {
              switchSortType(event.target.value);
            }}
          >
            <option value="views">Most Views</option>
            <option value="created">Recently Created</option>
            <option value="updated">Recently Updated</option>
          </Select>
          {data.referenceCard && (
            <Select
              defaultValue={zone}
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
            </Select>
          )}
        </div>
        <div>
          Showing {data.decks.length} of {data.totalResults} decks{" "}
        </div>
      </div>
      {data.totalPages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 my-2">
          {Array.from({ length: Math.min(20, data.totalPages) }, (_, i) => (
            <NavLink
              to={`?id=${id}&format=${format}&page=${
                i + 1
              }&sortType=${sortType}`}
              key={i}
            >
              <Button active={selectedPage === i} title={`${i + 1}`} />
            </NavLink>
          ))}
        </div>
      )}

      <DeckList decks={mappedDecks} type="moxfield" />
    </>
  );
};

export default MoxfieldDecksListPage;

export const loader = async ({ request }: any) => {
  const queryParameters = new URL(request.url).searchParams;
  let id = queryParameters.get("id") ?? "";
  let page = Number(queryParameters.get("page") ?? "1");
  const format = queryParameters.get("format") ?? "";
  const zone = queryParameters.get("zone");
  const sortType = queryParameters.get("sortType") ?? "";

  if (id) {
    return await moxfieldService.getDecksByCardId(
      id,
      format,
      page,
      zone === "commander",
      sortType
    );
  }
  return await moxfieldService.getDecks(
    format,
    page,
    zone === "commander",
    sortType
  );
};
