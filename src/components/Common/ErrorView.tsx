import "./ErrorView.css";

const ErrorView: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="errorView">
      <h2>Error</h2>
      <div>{message}</div>
    </div>
  );
};

export default ErrorView;
