import { User } from "../../models/dtos";
import Dialog from "../Common/Dialog";
import Select from "../Select";

const MatchCreationDialog: React.FC<{
  onSubmit: () => void;
  onClose: () => void;
  users: User[];
  setEnemyId: (id: number) => void;
}> = ({ onSubmit, onClose, users, setEnemyId }) => {
  return (
    <Dialog title="Create Match" onClose={onClose} onSubmit={onSubmit}>
      <div>
        <label htmlFor="enemy">Enemy</label>
      </div>
      <div className="mb-10">
        <Select
          name="enemy"
          onChange={(event) => setEnemyId(Number(event.target.value))}
        >
          {users.map((user, index) => (
            <option key={index} value={user.id}>
              {user.username}
            </option>
          ))}
        </Select>
      </div>
    </Dialog>
  );
};

export default MatchCreationDialog;
