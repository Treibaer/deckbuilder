import {
  Bars3Icon,
  MinusCircleIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/solid";
import { AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Button from "../components/Button";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import DeckPrintSelectionOverlay from "../components/Deck/DeckPrintSelectionOverlay";
import MagicCardView from "../components/MagicCardView";
import CardSearchFilter from "../components/Search/CardSearchFilter";
import SearchBar from "../components/Search/SearchBar";
import SearchPagination from "../components/Search/SearchPagination";
import { Deck, MagicCard } from "../models/dtos";
import { CardSize } from "../models/structure";
import CardService from "../Services/CardService";
import DeckService from "../Services/DeckService";

const Sandbox: React.FC<{ deck: Deck; refresh: () => void }> = ({
  deck,
  refresh,
}) => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");
  const page = searchParams.get("page");
  const selectedPage = page ? parseInt(page) - 1 : 0;

  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(q ?? "");
  const [sets, setSets] = useState<any[]>([]);
  const [cards, setCards] = useState<MagicCard[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState(0);

  useEffect(() => {
    setSearchTerm(q ?? "");
  }, [q]);

  useEffect(() => {
    async function fetchSets() {
      const sets = await CardService.shared.getSets();
      setSets(sets);
    }
    fetchSets();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchCards();
    async function fetchCards() {
      const cards = await CardService.shared.searchCards(
        q ?? "",
        "" + selectedPage
      );
      for (let card of cards.data) {
        card.versions = card.reprint ? 2 : 1;
        console.log(card.reprint ? 2 : 1);
      }
      setCards(cards.data);
      setPages(cards.amount / cards.data.length);
      setIsLoading(false);
    }
  }, [q, page]);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(event.target.value);
  }

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const [showFilter, setShowFilter] = useState(false);
  let [size, setSize] = useState(CardSize.normal);

  async function addToDeck(card: MagicCard) {
    await DeckService.shared.addCardToDeck(
      deck!,
      card.scryfallId,
      "mainboard",
      1
    );
    refresh();
  }

  async function removeOneFromDeck(card: MagicCard) {
    const quantity = deck!.mainboard.find(
      (c) => c.card.scryfallId === card.scryfallId
    )?.quantity;
    if (!quantity) return;
    await DeckService.shared.updateCardAmount(
      deck!,
      card.scryfallId,
      "mainboard",
      quantity - 1
    );
    refresh();
  }

  const [selectedCard, setSelectedCard] = useState<MagicCard | null>(null);

  function openPrintingsSelection(card: MagicCard) {
    setSelectedCard(transformCard(card));
  }

  function handleSearch() {
    navigate(`/decks/my/${deck.id}?q=${searchTerm}`);
  }

  function submitFilter(query: string) {
    navigate(`/decks/my/${deck.id}?q=${query}`);
    setShowFilter(false);
  }

  function goToPage(page: number) {
    let url = `/decks/my/${deck.id}?q=${searchTerm}&page=${page}`;
    navigate(url);
  }

  function transformCard(card: any): MagicCard {
    return {
      scryfallId: card.scryfallId,
      oracleId: card.oracle_id,
      name: card.name,
      typeLine: card.type_line,
      versions: card.reprint ? 2 : 1,
      printsSearchUri: card.prints_search_uri,
      cardFaces: [],
      releasedAt: card.released_at,
      setCode: card.set,
      setName: card.set_name,
      oracleText: card.oracle_text,
      manaCost: card.mana_cost,
      image: card.image_uris.normal,
      colors: card.colors,
      rarity: card.rarity,
      mapping: card.mapping,
    };
  }

  function overrideCard(card: MagicCard, print: MagicCard) {
    const updatedCards = cards.map((c) => {
      if (c.scryfallId === card.scryfallId) {
        return print;
      }
      return c;
    });
    setCards(updatedCards as any);
    setSelectedCard(null);
  }

  const updatedCards = cards.map((card) => {
    const sumOfCards = deck!.mainboard.reduce((acc, c) => {
      if (c.card.oracleId === card.oracleId) {
        return acc + c.quantity;
      }
      return acc;
    }, 0);
    return {
      ...card,
      quantity: deck!.mainboard.find(
        (c) => c.card.scryfallId === card.scryfallId
      )?.quantity,
      allQuantity: sumOfCards,
    };
  });

  return (
    <div className="mx-auto w-full select-none">
      <div className="cursor-default text-3xl font-semibold m-2 text-center">
        Sandbox
      </div>
      <AnimatePresence>
        {selectedCard && (
          <div className="fixed z-30">
            <DeckPrintSelectionOverlay
              closeOverlay={() => setSelectedCard(null)}
              card={selectedCard}
              setPrint={overrideCard}
            />
          </div>
        )}
      </AnimatePresence>
      <SearchBar
        handleSearch={handleSearch}
        searchTerm={searchTerm}
        handleChange={handleChange}
        setShowFilter={setShowFilter}
      />
      <CardSearchFilter
        query={searchTerm}
        sets={sets}
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        onSubmit={submitFilter}
      />
      <SearchPagination
        pages={pages}
        selectedPage={selectedPage}
        goToPage={goToPage}
      />

      {!isLoading && (
        <div className="gap-2 hidden md:flex justify-center w-full mt-4">
          {[CardSize.small, CardSize.normal, CardSize.large].map((s) => (
            <Button
              active={size === s}
              key={s}
              onClick={() => setSize(s)}
              title={s}
            />
          ))}
        </div>
      )}
      <div
        id="card-container"
        className="flex flex-wrap justify-center gap-2 mt-4"
      >
        {isLoading && <LoadingSpinner inline size={20} />}
        {!isLoading &&
          updatedCards.map((card, _) => (
            <div key={card.scryfallId} className="relative">
              <MagicCardView
                size={size}
                card={card}
                // onTap={() => setSelectedCard(card)}
                hoverable={true}
              />
              {card.allQuantity > 0 && (
                <div className="text-2xl absolute top-2 left-2 text-white bg-gray-700 rounded w-8 h-8 flex justify-center items-center">
                  {card.allQuantity}
                </div>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-4 items-center">
                <PlusCircleIcon
                  title="Add to Deck"
                  className="h-8 w-8 text-green-700 cursor-pointer bg-gray-300 rounded-full hover:bg-gray-300 hover:text-green-500"
                  onClick={() => addToDeck(card)}
                />
                {card.quantity && card.quantity > 0 && (
                  <>
                    <div className="text-2xl text-black bg-gray-300 rounded w-8 h-8 flex justify-center items-center">
                      {card.quantity}
                    </div>
                    <MinusCircleIcon
                      title="Remove from Deck"
                      className="h-8 w-8 text-red-700 cursor-pointer bg-gray-300 rounded-full hover:bg-gray-300 hover:text-red-500"
                      onClick={() => removeOneFromDeck(card)}
                    />
                  </>
                )}
                {card.versions > 1 && (
                  <Bars3Icon
                    title="View Printings"
                    className="h-8 w-8  border-white border-4 text-black cursor-pointer bg-white rounded-full hover:border-gray-200"
                    onClick={() => openPrintingsSelection(card)}
                  />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Sandbox;
