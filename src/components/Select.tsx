const Select: React.FC<{
  defaultValue?: string | number | readonly string[] | undefined;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  name?: string;
  disabled?: boolean;
  children: React.ReactNode;
}> = ({ defaultValue , onChange, name, disabled, children }) => {
  return (
    <select
      className="tb-select bg-mediumBlue w-full disabled:bg-lightBlue"
      onChange={onChange}
      defaultValue={defaultValue}
      name={name}
      disabled={disabled}
    >
      {children}
    </select>
  );
};

export default Select;
