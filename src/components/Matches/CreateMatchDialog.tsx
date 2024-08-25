import Dialog from "../Common/Dialog";

const CreateMatchDialog: React.FC<{
  onSubmit: () => void;
  onClose: () => void;
  users: any[];
  setEnemyId: (id: number) => void;
}> = ({ onSubmit, onClose, users, setEnemyId })  => {
  return (
    <div className="fullscreenBlurWithLoading">
      <Dialog title="Create Match" onClose={onClose} onSubmit={onSubmit}>
        <div className="formRow">
          <label htmlFor="enemy">Enemy</label>
        </div>
        <div className="formRow">
          <select
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
    </div>
  );
}

export default CreateMatchDialog;
