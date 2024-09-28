import { PlusIcon } from "@heroicons/react/24/outline";
import Button from "./Button";

const AddButton: React.FC<{
  title?: string;
  onClick?: () => void;
}> = ({ title, onClick }) => {
  return (
    <Button title={title} onClick={onClick}>
      <PlusIcon className="size-5" />
    </Button>
  );
};

export default AddButton;
