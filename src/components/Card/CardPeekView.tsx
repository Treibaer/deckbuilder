import { HeartIcon as HeartIcon2 } from "@heroicons/react/24/outline";
import {
  ArrowTopRightOnSquareIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import rotateImage from "../../assets/rotate.svg";
import { MagicCard } from "../../models/dtos";
import MagicHelper from "../../Services/MagicHelper";
import MoxfieldService from "../../Services/MoxfieldService";
import Button from "../Button";
import DelayedLoadingSpinner from "../Common/DelayedLoadingSpinner";
import AddCardToDeckDialog from "./AddCardToDeckDialog";
import "./CardPeekView.css";
import { motion } from "framer-motion";

const CardPeekView: React.FC<{
  card: MagicCard;
  onClose: () => void;
  updateFavorite?: () => void;
}> = ({ card, onClose, updateFavorite }) => {
  const [faceSide, setFaceSide] = useState(0);
  const [showAddToDeck, setShowAddToDeck] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const card2: any = card;
  // be compatible with scryfall api
  if (card2.card_faces && card2.card_faces.length > 0) {
    card.cardFaces = card2.card_faces;
  }
  if (!card.cardFaces) {
    card.cardFaces = [];
  }
  if (card2.image_uris) {
    card.cardFaces = [];
  }

  async function checkFavorite() {
    const isFav = await MoxfieldService.shared.isFavoriteCard(card.scryfallId);
    setIsFavorite(isFav);
  }

  useEffect(() => {
    checkFavorite();
  }, []);

  function changeFaceSide() {
    setFaceSide((faceSide) => (faceSide + 1) % card.cardFaces.length);
  }

  async function setAsFavorite() {
    await MoxfieldService.shared.setFavoriteCard(card.scryfallId, !isFavorite);
    await checkFavorite();
    updateFavorite && updateFavorite();
  }
  return (
    <motion.div
      id="peekCardView"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0, duration: 0.3 }}
    >
      <div className="background" onClick={onClose}></div>
      {showAddToDeck && (
        <AddCardToDeckDialog
          onClose={() => setShowAddToDeck(false)}
          card={card}
          setIsLoading={setIsLoading}
        />
      )}
      {isLoading && <DelayedLoadingSpinner />}
      <div className="flex gap-2">
        <Button title="Close" onClick={onClose} />
        <Button onClick={setAsFavorite}>
          {isFavorite ? (
            <HeartIcon className="h-6 w-6 text-brightBlue" />
          ) : (
            <HeartIcon2 className="h-6 w-6 text-brightBlue" />
          )}
        </Button>
        <Button title="Add to deck" onClick={() => setShowAddToDeck(true)} />
        <Link to={"/cards/" + card.scryfallId} target="_blank">
          <Button title="Card details ">
            <ArrowTopRightOnSquareIcon className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      <div className="relative-wrapper">
        <div
          className={`image-wrapper ${faceSide === 0 ? "normal" : "flipped"}`}
        >
          <img
            src={MagicHelper.determineImageUrl(card, faceSide)}
            onClick={onClose}
            alt={card.name}
          />
        </div>
        {card.cardFaces.length > 0 && (
          <img
            src={rotateImage}
            alt="R"
            className="magicCardRotateButton"
            onClick={changeFaceSide}
          />
        )}
      </div>
    </motion.div>
  );
};

export default CardPeekView;
