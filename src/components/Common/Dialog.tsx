import Button from "../Decks/Button";
import ErrorView from "./ErrorView";

const Dialog: React.FC<{
  title: string;
  error?: { message: string };
  onClose: () => void;
  onSubmit: () => void;
  submitTitle?: string;
  children: React.ReactNode;
}> = ({ title, error, onClose, onSubmit, children, submitTitle }) => {
  return (
    <div className="fullscreenBlurWithLoading">
      <div className="tb-dialog2">
        {error && <ErrorView message={error.message} />}
        <div className="titleBar">
          <h3>{title}</h3>
          <div className="closeButton">
            <Button title="X" onClick={onClose} />
          </div>
        </div>
        {children}
        <div className="actionBar">
          <Button title={submitTitle ?? "Create"} onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Dialog;
