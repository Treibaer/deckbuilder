import { useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import Button from "../components/Button";
import TitleView from "../components/Common/TitleView";
import DraftCreateView from "../components/DraftCreateView";
import { CardSet } from "../models/dtos";
import CardService from "../Services/CardService";

const cardService = CardService.shared;

const DraftView = () => {
  const [isCreatingDraft, setIsCreatingDraft] = useState(false);
  const drafts = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const sets = useLoaderData() as CardSet[];

  function closeDialog() {
    setIsCreatingDraft(false);
  }
  return (
    <div>
      <TitleView title="Drafts" openDialog={() => setIsCreatingDraft(true)} />

      {isCreatingDraft && (
        <DraftCreateView closeDialog={closeDialog} sets={sets} />
      )}

      <div className="flex flex-col gap-4">
        {drafts.map((draft) => (
          <Link to={`/drafts/${draft.id}`} key={draft.id} className="flex gap-2 items-center">
            <div>{draft.id}</div>
            <Button title="Join" />
          </Link>
        ))}
      </div>
    </div>
  );
};

export const loader = async () => {
  return await cardService.getSets();
};

export default DraftView;
