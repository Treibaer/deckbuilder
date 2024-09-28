import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import DeckService from "../../Services/DeckService";
import { Deck, DeckFolder } from "../../models/dtos";
import Button from "../Button";
import ConfirmationDialog from "../Common/ConfirmationDialog";
import Dialog from "../Common/Dialog";
import Select from "../Select";

const DeckUpdateDialog: React.FC<{
  deck: Deck;
  folders: DeckFolder[];
  onClose: () => void;
  update: () => Promise<void>;
}> = ({ deck, onClose, update, folders }) => {
  const navigator = useNavigate();
  const [error, setError] = useState<string | undefined>(undefined);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [folderId, setFolderId] = useState<number | null>(deck.folderId);

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
    if (!name) {
      setError("Name is required");
      return;
    }
    try {
      await DeckService.shared.updateDeck(deck, name, folderId);
      onClose();
      await update();
    } catch (error: Error | any) {
      setError(error.message);
    }
  }

  async function toggleArchive() {
    await DeckService.shared.toggleArchive(deck);
    await update();
  }

  function handleChangeFolder(event: React.ChangeEvent<HTMLSelectElement>) {
    if (!event.target.value) {
      setFolderId(null);
      return;
    }
    setFolderId(Number(event.target.value));
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
          className="tb-input"
          defaultValue={deck.name}
          ref={nameInputRef}
        />

        <Select
          onChange={handleChangeFolder}
          defaultValue={deck.folderId ?? undefined}
          disabled={deck.isArchived}
        >
          <option value=""> No folder</option>
          {folders.map((folder, index) => (
            <option key={index} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Button
            className="w-32 text-red-300"
            title="Delete"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deck.isLocked}
          />
          <Button
            className="w-32 text-red-300"
            title={deck.isArchived ? "Unarchive" : "Archive"}
            onClick={toggleArchive}
          />
        </div>
      </Dialog>
      {showDeleteConfirm && (
        <div className="fullscreenBlurWithLoading">
          <ConfirmationDialog
            onCancel={() => setShowDeleteConfirm(false)}
            onConfirm={deleteDeck}
          />
        </div>
      )}
    </>
  );
};

export default DeckUpdateDialog;
