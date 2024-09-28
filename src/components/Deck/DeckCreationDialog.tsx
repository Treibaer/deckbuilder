import { useEffect, useRef, useState } from "react";
import Dialog from "../Common/Dialog";

const DeckCreationDialog: React.FC<{
  onSubmit: (name: string, folderId: number | null) => void;
  onClose: () => void;
  folders: any[];
  currentFolderId: number | null;
}> = ({ onSubmit, onClose, folders, currentFolderId }) => {
  const [name, setName] = useState("");
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(
    currentFolderId
  );
  const [error, setError] = useState<string | undefined>(undefined);
  const deckInputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (!name) {
      setError("Name is required");
      return;
    }

    onSubmit(name, selectedFolderId);
  }

  useEffect(() => {
    setTimeout(() => {
      deckInputRef.current?.focus();
    }, 100);
  }, []);

  function handleChangeFolder(event: React.ChangeEvent<HTMLSelectElement>) {
    if (!event.target.value) {
      setSelectedFolderId(null);
      return;
    }
    setSelectedFolderId(Number(event.target.value));
  }

  return (
    <Dialog
      title="Create Deck"
      onClose={onClose}
      onSubmit={handleSubmit}
      error={error}
    >
      <label htmlFor="name">Name</label>
      <input
        autoComplete="off"
        className="tb-input"
        type="text"
        ref={deckInputRef}
        onChange={(event) => setName(event.target.value)}
      />
      <label htmlFor="folder">Folder</label>
      <select
        className="tb-select bg-mediumBlue w-full mb-10"
        name="enemy"
        onChange={handleChangeFolder}
        defaultValue={currentFolderId ? currentFolderId : ""}
      >
        <option value=""> No folder</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </select>
    </Dialog>
  );
};

export default DeckCreationDialog;
