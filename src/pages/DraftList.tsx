import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import DraftCreateView from "../components/DraftCreateView";
import CardService from "../Services/CardService";
import { CardSet } from "../models/dtos";

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
      <div className="headline">
        <h1>Drafts</h1>
        <button
          className="tb-button"
          onClick={() => {
            setIsCreatingDraft(true);
          }}
        >
          Create
        </button>
      </div>

      {isCreatingDraft && (
        <DraftCreateView closeDialog={closeDialog} sets={sets} />
      )}

      <ul id="draft-wrapper">
        {drafts.map((draft, index) => (
          <li key={index}>
            <div>
              {draft.id}
              <button className="tb-button">Join</button>
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