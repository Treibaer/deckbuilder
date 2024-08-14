import React, { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import CardService from "../Services/CardService";
import DeckService from "../Services/DeckService";
import Helper from "../Services/Helper";
import Dialog from "../components/Common/Dialog";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MagicCardView from "../components/MagicCardView";
import "./CardDetailView.css";

export default function CardDetailView() {
  const mousePosition = useMousePosition();
  const cardDetails = useLoaderData();
  const [previewImage, setPreviewImage] = useState(null);
  const [myDecks, setMyDecks] = useState(null);
  const [selectedDeckId, setSelectedDeckId] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const card = cardDetails?.card;
  const printings = cardDetails?.printings ?? [];

  const [showAddToDeck, setShowAddToDeck] = useState(false);

  async function openAddToCartDialog() {
    setShowAddToDeck(true);
    const currentDecks = await DeckService.shared.loadMyDecks();
    setSelectedDeckId(currentDecks[0]?.id);
    setMyDecks(currentDecks);
  }

  async function addCardToDeck() {
    setIsLoading(true);
    setShowAddToDeck(false);
    const deck = myDecks.filter((deck) => deck.id === selectedDeckId)[0];
    await DeckService.shared.addCardToDeck(
      deck,
      card,
      "mainboard",
      selectedQuantity
    );

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  }

  function close() {
    setShowAddToDeck(false);
    setMyDecks(null);
  }

  return (
    <div key={card?.scryfallId}>
      {isLoading && <LoadingSpinner />}
      {showAddToDeck && (
        <Dialog
          title="Add to Deck"
          onClose={close}
          onSubmit={addCardToDeck}
          submitTitle="Add"
        >
          <div className="cardPreview">
            <MagicCardView card={card} size="small" />
          </div>
          <div className="deckSelect">
            {!myDecks && (
              <select disabled>
                <option>Loading...</option>
              </select>
            )}
            {myDecks && (
              <select
                name="deck"
                id="deck"
                onChange={(event) => {
                  setSelectedDeckId(event.target.value);
                }}
              >
                {myDecks.map((deck) => (
                  <option key={deck.id} value={deck.id}>
                    [{deck.id}] {deck.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="quantitySelect">
            <select
              onChange={(event) => {
                setSelectedQuantity(event.target.value);
              }}
            >
              {[...Array(10).keys()].map((i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
        </Dialog>
      )}
      <h1> {card.name}</h1>
      {card && (
        <div className="card-content">
          <MagicCardView card={card} size="large" />
          <div className="card-details">
            <div className="card-headline">
              <div>
                {Helper.convertCostsToImgArray(card.manaCost ?? card.mana_cost)}
              </div>
            </div>
            <div>{card.typeLine}</div>
            <div>{card.oracleText}</div>
            {printings && (
              <>
                <h2>Printings</h2>
                {previewImage && (
                  <div
                    className="printingsPreview"
                    style={{
                      position: "absolute",
                      top: mousePosition.y + 10,
                      left: mousePosition.x + 10,
                    }}
                  >
                    <img src={previewImage} alt="preview" />
                  </div>
                )}
                <ul className="printings">
                  {printings.map((print, index) => {
                    const isSelected = card.scryfallId === print.scryfallId;
                    return (
                      <li
                        key={index}
                        className={isSelected ? "selected" : undefined}
                      >
                        {isSelected && (
                          <div key={print.id} className="print">
                            <div title={print.setName}>{print.setName}</div>
                          </div>
                        )}
                        {!isSelected && (
                          <Link
                            to={`/cards/${print.scryfallId}`}
                            key={print.scryfallId}
                            onMouseEnter={() => setPreviewImage(print.image)}
                            onMouseLeave={() => setPreviewImage(null)}
                            onClick={() => setPreviewImage(null)}
                          >
                            <div className="print">
                              <div title={print.setName}>{print.setName}</div>
                            </div>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
          <div>
            <div className="actionButtons">
              <button className="tb-button" onClick={openAddToCartDialog}>
                Add to deck
              </button>
              <button className="tb-button">Save for later</button>
              {card.mapping && (
                <Link to={"/decks/moxfield?id=" + card.mapping}>
                  <button className="tb-button">Find decks with</button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export const loader = async ({ params }) => {
  return await CardService.shared.getCardById(params.cardId);
};

const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({
    x: null,
    y: null,
  });

  useEffect(() => {
    const updateMousePosition = (ev) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return mousePosition;
};
