import EditButton from "../EditButton";

export const TitleView: React.FC<{ title: string; openDialog: () => void }> = ({
  title,
  openDialog,
}) => {
  return (
    <div className="flex justify-center items-center gap-4 m-2 select-none">
      <div className="cursor-default text-3xl font-semibold">{title}</div>
      <EditButton onClick={openDialog} />
    </div>
  );
};

export default TitleView;
