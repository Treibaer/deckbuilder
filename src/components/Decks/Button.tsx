interface ButtonProps {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ title, onClick, disabled }) => {
  return (
    <button className="tb-button" onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
};

export default Button;
