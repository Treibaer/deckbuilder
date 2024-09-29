import { useEffect, useRef, useState } from "react";
import {
  Link,
  useLoaderData,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import AddButton from "../components/AddButton";
import Button from "../components/Button";
import ConfirmationDialog from "../components/Common/ConfirmationDialog";
import DelayedLoadingSpinner from "../components/Common/DelayedLoadingSpinner";
import Dialog from "../components/Common/Dialog";
import DeckCreationDialog from "../components/Deck/DeckCreationDialog";
import DeckList from "../components/Deck/DecksListWrapper";
import EditButton from "../components/EditButton";
import { Deck } from "../models/dtos";
import DeckService from "../Services/DeckService";

const deckService = DeckService.shared;

const CustomDecksListPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isCreatingDeck, setIsCreatingDeck] = useState(false);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [isUpdatingFolder, setIsUpdatingFolder] = useState(false);
  const data = useLoaderData() as { decks: Deck[]; folders: any[] };
  const [myDecks, setMyDecks] = useState<Deck[]>(data.decks);
  const [folders, setFolders] = useState(data.folders);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const editFolderInputRef = useRef<HTMLInputElement>(null);

  const [showDeletionConfirmation, setShowDeletionConfirmation] =
    useState(false);

  const folderId = searchParams.get("folderId")
    ? parseInt(searchParams.get("folderId")!)
    : null;

  useEffect(() => {
    setMyDecks(data.decks);
  }, [data.decks]);

  async function createDeck(name: string, newFolderId: number | null) {
    setIsUpdating(true);

    try {
      await deckService.create(name, newFolderId);
      let decks = await deckService.getAll(folderId);
      setMyDecks(decks);
      setIsCreatingDeck(false);
      setError(undefined);
    } catch (error) {
      console.log(error);
      setError("Failed to create deck");
    }
    setIsUpdating(false);
  }

  async function createFolder() {
    setIsUpdating(true);
    if (!folderInputRef.current?.value) {
      setError("Name is required");
      setIsUpdating(false);
      return;
    }
    try {
      await deckService.createFolder(folderInputRef.current.value);
      const newFolders = await deckService.getFolders();
      setFolders(newFolders);
      setIsCreatingFolder(false);
      setError(undefined);
    } catch (error: any) {
      console.log(error);
      setError(error.message ?? "Failed to create deck");
    }
    setIsUpdating(false);
  }

  async function updateFolder() {
    setIsUpdating(true);
    if (!editFolderInputRef.current?.value) {
      setError("Name is required");
      setIsUpdating(false);
      return;
    }
    try {
      await deckService.updateFolder(
        folderId!,
        editFolderInputRef.current.value
      );
      const newFolders = await deckService.getFolders();
      setFolders(newFolders);
      setIsUpdatingFolder(false);
      setError(undefined);
    } catch (error: any) {
      console.log(error);
      setError(error.message ?? "Failed to create deck");
    }
    setIsUpdating(false);
  }

  async function deleteFolder() {
    setIsUpdating(true);
    setShowDeletionConfirmation(false);
    try {
      await deckService.deleteFolder(folderId!);
      const newFolders = await deckService.getFolders();
      setFolders(newFolders);
      setIsUpdatingFolder(false);
      setError(undefined);
      navigate("/decks/my");
    } catch (error: any) {
      console.log(error);
      setError(error.message ?? "Failed to create deck");
    }
    setIsUpdating(false);
  }

  function showDeckForm() {
    setIsCreatingDeck(true);
  }

  function showFolderForm() {
    setIsCreatingFolder(true);
    setTimeout(() => {
      folderInputRef.current?.focus();
    }, 100);
  }

  function showFolderEditForm() {
    setIsUpdatingFolder(true);
    setTimeout(() => {
      editFolderInputRef.current?.focus();
    }, 100);
  }

  const mappedDecks = myDecks.map((deck) => {
    return {
      id: deck.id,
      promoId: deck.promoId,
      link: `/decks/my/${deck.id}`,
      name: deck.name,
      format: deck.format,
      viewCount: deck.viewCount,
      cardCount: deck.cardCount,
      colors: [],
    };
  });

  let title: string;
  switch (folderId) {
    case 0:
      title = "Archived Decks";
      break;
    case null:
      title = "All Decks";
      break;
    default:
      title = folders.find((f) => f.id === folderId)?.name || "Folder";
  }

  return (
    <div>
      {isCreatingDeck && (
        <DeckCreationDialog
          folders={folders}
          onSubmit={createDeck}
          currentFolderId={folderId}
          onClose={() => setIsCreatingDeck(false)}
        />
      )}
      {isCreatingFolder && (
        <Dialog
          title="Create Folder"
          onClose={() => setIsCreatingFolder(false)}
          onSubmit={createFolder}
          error={error}
        >
          <label htmlFor="name">Name</label>
          <input
            autoComplete="off"
            ref={folderInputRef}
            className="tb-input mb-10"
            type="text"
          />
        </Dialog>
      )}
      {isUpdatingFolder && (
        <Dialog
          title="Update Folder"
          submitTitle="Update"
          onClose={() => setIsUpdatingFolder(false)}
          onSubmit={updateFolder}
          error={error}
        >
          <label htmlFor="name">Name</label>
          <input
            autoComplete="off"
            ref={editFolderInputRef}
            className="tb-input mb-10"
            type="text"
            defaultValue={title}
          />
          <Button
            className="w-32 text-red-300"
            title="Delete"
            onClick={() => setShowDeletionConfirmation(true)}
          />
        </Dialog>
      )}
      {showDeletionConfirmation && (
        <div className="fullscreenBlurWithLoading">
          <ConfirmationDialog
            onCancel={() => setShowDeletionConfirmation(false)}
            onConfirm={deleteFolder}
          />
        </div>
      )}
      {isUpdating && <DelayedLoadingSpinner />}
      <div className="flex gap-2 flex-wrap items-center flex-row justify-center mb-4">
        <div className="text-3xl font-semibold text-nowrap text-ellipsis overflow-hidden text-center">{title}</div>
        {folderId !== null && folderId !== 0 && (
          <EditButton onClick={showFolderEditForm} />
        )}
        {folderId !== 0 && (
          <AddButton title="Create Deck" onClick={showDeckForm} />
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <div>
          <div className="flex gap-2 justify-center items-center flex-row">
            <div>Folders</div>
            <AddButton onClick={showFolderForm} />
          </div>
          <div className="flex flex-col mx-auto gap-2 sm:w-32">
            <Link to="/decks/my">
              <div
                className={folderId === null ? "text-brightBlue" : undefined}
              >
                All
              </div>
            </Link>
            {folders.map((folder) => (
              <Link key={folder.id} to={`/decks/my?folderId=${folder.id}`}>
                <div
                  title={folder.name}
                  className={
                    "w-32 text-nowrap text-ellipsis overflow-hidden " +
                    (folderId === folder.id ? "text-brightBlue" : undefined)
                  }
                >
                  {folder.name}
                </div>
              </Link>
            ))}
            <Link to="/decks/my?folderId=0">
              <div className={folderId === 0 ? "text-brightBlue" : undefined}>
                Archived
              </div>
            </Link>
          </div>
        </div>
        <div>
          {myDecks.length === 0 && <p>No decks found</p>}
          <DeckList decks={mappedDecks} type="custom" />
        </div>
      </div>
    </div>
  );
};

export default CustomDecksListPage;

export const loader = async ({ request }: any) => {
  const queryParameters = new URL(request.url).searchParams;
  let folderId = queryParameters.get("folderId");

  const decks = await deckService.getAll(folderId ? parseInt(folderId) : null);
  const folders = await deckService.getFolders();

  return { decks, folders };
};
