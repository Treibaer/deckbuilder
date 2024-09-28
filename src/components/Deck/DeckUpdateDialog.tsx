import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeckService from "../../Services/DeckService";
import { Deck } from "../../models/dtos";
import Button from "../Button";
import ConfirmationDialog from "../Common/ConfirmationDialog";
import Dialog from "../Common/Dialog";

const DeckUpdateDialog: React.FC<{
  deck: Deck;
  onClose: () => void;
  update: () => Promise<void>;
}> = ({ deck, onClose, update }) => {
  const navigator = useNavigate();
  const [error, setError] = useState<string | undefined>(undefined);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState(false);


    useEffect(() => {
      setTimeout(() => {
        nameInputRef.current?.focus();
      }, 100);
    }, []);

  async function deleteDeck() {
    await DeckService.shared.deleteDeck(deck);
    if (deck.folderId !== null) {
      console.log(deck.folderId);
      navigator(`/decks/my?folderId=${deck.folderId}`);
      return;
    }
    navigator("/decks/my");
  }

  async function handleUpdateName() {
    const name = nameInputRef.current?.value;
    if (name) {
      try {
        await DeckService.shared.setName(deck, name);
        onClose();
        await update();
      } catch (error: Error | any) {
        setError(error.message);
      }
    } else {
      setError("Title is required");
    }
  }

  async function toggleArchive() {
    await DeckService.shared.toggleArchive(deck);
    await update();
  }

  return (
    <>
      <Dialog
        title="Update Deck"
        submitTitle="Update"
        onClose={onClose}
        onSubmit={handleUpdateName}
        error={error}
      >
        <input
          type="text"
          placeholder="Deck name"
          className="tb-input mb-10"
          defaultValue={deck.name}
          ref={nameInputRef}
        />
        <div className="flex gap-2">
          <Button
            className="w-32 text-red-300"
            title="Delete"
            onClick={() => setShowDeletionConfirmation(true)}
            disabled={deck.isLocked}
          />
          <Button
            className="w-32 text-red-300"
            title={deck.isArchived ? "Unarchive" : "Archive"}
            onClick={toggleArchive}
          />
        </div>
      </Dialog>
      {showDeletionConfirmation && (
        <div className="fullscreenBlurWithLoading">
          <ConfirmationDialog
            onCancel={() => setShowDeletionConfirmation(false)}
            onConfirm={deleteDeck}
          />
        </div>
      )}
    </>
  );
};

export default DeckUpdateDialog;
