import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { ButtonIcon } from "./ButtonIcon";

const EditButton: React.FC<{
  onClick?: () => void;
}> = ({ onClick }) => {
  return (
    <ButtonIcon onClick={onClick}>
      <PencilSquareIcon className="size-5" />
    </ButtonIcon>
  );
};

export default EditButton;
