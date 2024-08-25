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
            <button className="tb-button" onClick={onClose}>
              X
            </button>
          </div>
        </div>
        {children}
        <div className="actionBar">
          <button className="tb-button" onClick={onSubmit}>
            {submitTitle ?? "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
