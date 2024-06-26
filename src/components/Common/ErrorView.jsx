import "./ErrorView.css";

export default function ErrorView({ message }) {
  return (
    <div className="errorView">
      <h2>Error</h2>
      <div>{message}</div>
    </div>
  );
}
