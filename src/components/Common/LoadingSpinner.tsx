import "./LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="fullscreenBlurWithLoading">
      <div className="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
