import React, { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import CardService from "../../Services/CardService";
import MagicCardView from "./MagicCardView";

import "./CardDetailView.css";
import Helper from "./Helper";
import DeckService from "../../Services/DeckService";
import LoadingSpinner from "../Common/LoadingSpinner";

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
    // wait 1 second
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const currentDecks = await DeckService.shared.loadMyDecks();
    setSelectedDeckId(currentDecks[0]?.id);
    setMyDecks(currentDecks);
  }

  async function addCardToDeck() {
    setIsLoading(true);
    setShowAddToDeck(false);
    const deck = myDecks.filter((deck) => deck.id === selectedDeckId)[0];
    await DeckService.shared.addCardToDeck(deck, card, "mainboard", selectedQuantity);

    // await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  }

  function closeAddToCartDialog() {
    setShowAddToDeck(false);
    setMyDecks(null);
  }

  return (
    <div key={card?.id}>
      {isLoading && <LoadingSpinner />}
      {showAddToDeck && (
        <div className="fullscreenBlurWithLoading">
          <div className="addToDeck">
            <div className="titleBar">
              <h3>Add to Deck</h3>
              <div className="closeButton">
                <button onClick={closeAddToCartDialog}>X</button>
              </div>
            </div>
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
            <div className="actionBar">
              <button onClick={closeAddToCartDialog}>Cancel</button>
              <button
                disabled={myDecks?.length > 0 ? undefined : "disabled"}
                onClick={addCardToDeck}
              >
                Add to Deck
              </button>
            </div>
          </div>
        </div>
      )}
      <h1>Card Detail View</h1>
      {card && (
        <div className="card-content">
          <MagicCardView card={card} size="large" />
          <div className="card-details">
            <div className="card-headline">
              <div> {card.name}</div>
              <div>
                {Helper.convertCostsToImgArray(card.manaCost ?? card.mana_cost)}
              </div>
            </div>
            <div>{card.typeLine}</div>
            <div>{card.oracleText}</div>
            {printings && (
              <>
                <div>Printings</div>
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
                {/* {JSON.stringify(mousePosition)} */}
                <div className="printingsWrapper">
                  {printings.map((print, index) => {
                    return (
                      <div key={index}>
                        {card.id === print.id && (
                          <div key={print.id} className="print">
                            <div title={print.setName}>{print.setName}</div>
                          </div>
                        )}
                        {card.id !== print.id && (
                          <Link
                            to={`/cards/${print.id}`}
                            key={print.id}
                            onMouseEnter={() => setPreviewImage(print.image)}
                            onMouseLeave={() => setPreviewImage(null)}
                            onClick={() => setPreviewImage(null)}
                          >
                            <div className="print">
                              <div title={print.setName}>{print.setName}</div>
                            </div>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div>
            <div className="actionButtons">
              <button onClick={openAddToCartDialog}>Add to deck</button>
              <button>Save for later</button>
              {card.mapping && (
                <Link to={"/decks/moxfield?id=" + card.mapping}>
                  <button>Find decks with</button>
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
  const [mousePosition, setMousePosition] = React.useState({
    x: null,
    y: null,
  });

  React.useEffect(() => {
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
