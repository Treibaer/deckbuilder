import Dialog from "../Common/Dialog";

export default function CreateMatchDialog({ onSubmit, onClose, users, setEnemyId }) {
  return (
    <div className="fullscreenBlurWithLoading">
      <Dialog title="Create Match" onClose={onClose} onSubmit={onSubmit}>
        <div className="formRow">
          <label htmlFor="enemy">Enemy</label>
        </div>
        <div className="formRow">
          <select
            name="enemy"
            onChange={(event) => setEnemyId(event.target.value)}
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
