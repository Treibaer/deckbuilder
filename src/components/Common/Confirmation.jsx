export default function Confirmation({ onConfirm, onCancel }) {
  return (
    <div className="tb-dialog2">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove?</p>
      <div className="tb-button-group">
        <button onClick={onCancel} className="tb-button">
          No
        </button>
        <button onClick={onConfirm} className="tb-button">
          Yes
        </button>
      </div>
    </div>
  );
}
