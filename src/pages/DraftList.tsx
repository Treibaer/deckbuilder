import { useState } from "react";
import { useLoaderData } from "react-router-dom";
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

      <ul id="draft-wrapper">
        {drafts.map((draft, index) => (
          <li key={index}>
            <div>
              {draft.id}
              <Button title="Join" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const loader = async () => {
  return await cardService.getSets();
};

export default DraftView;
