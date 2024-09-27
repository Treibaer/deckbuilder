import { User } from "../../models/dtos";
import Dialog from "../Common/Dialog";

const MatchCreationDialog: React.FC<{
  onSubmit: () => void;
  onClose: () => void;
  users: User[];
  setEnemyId: (id: number) => void;
}> = ({ onSubmit, onClose, users, setEnemyId }) => {
  return (
    <Dialog title="Create Match" onClose={onClose} onSubmit={onSubmit}>
      <div className="formRow">
        <label htmlFor="enemy">Enemy</label>
      </div>
      <div className="formRow">
        <select
          className="tb-select bg-transparent w-full mb-10"
          name="enemy"
          onChange={(event) => setEnemyId(Number(event.target.value))}
        >
          {users.map((user, index) => (
            <option key={index} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>
    </Dialog>
  );
};

export default MatchCreationDialog;
