interface ButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  active?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onClick,
  disabled,
  className,
  active,
}) => {
  if (disabled) {
    return (
      <button
        className={`disabled bg-slate-600 px-3 text-nowrap inline rounded-custom-tb h-7 border-solid border border-slate-700`}
        disabled
      >
        {title}
      </button>
    );
  }
  return (
    <button
      className={`${className} ${
        active ? "border-brightBlue" : "border-slate-700"
      } bg-customBlue px-3 text-nowrap inline rounded-custom-tb h-7 border-solid border  hover:bg-lightBlue`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
