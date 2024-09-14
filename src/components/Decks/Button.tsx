interface ButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ title, onClick, disabled, className }) => {
  return (
    <button className={`tb-button ${className}`} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
};

export default Button;
