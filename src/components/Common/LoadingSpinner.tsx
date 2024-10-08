const LoadingSpinner: React.FC<{ inline?: boolean, size?: number }> = ({ inline, size }) => {
  let classes = "border-8 w-20 h-20 absolute";
  if (inline) {
    classes = "border-2 w-8 h-8";
  }
  if (size) {
    classes = `border-8 w-${size} h-${size}`;
  }
  return (
    <div className={inline ? "" : "-translate-x-10 -translate-y-10"}>
      <div className={`${classes} rounded-full border-[rgb(53,56,74)] border-b-[#646cff] box-border inline-block animate-spin`}></div>
    </div>
  );
};

export default LoadingSpinner;
