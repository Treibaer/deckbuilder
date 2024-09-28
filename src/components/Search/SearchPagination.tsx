import Button from "../Button";

const SearchPagination: React.FC<{
  pages: number;
  selectedPage: number;
  goToPage: (page: number) => void;
}> = ({ pages, selectedPage, goToPage }) => {
  return (
    <>
      {pages > 1 && (
        <div className="flex flex-wrap justify-center gap-2 mt-2">
          {Array.from({ length: pages }, (_, i) => (
            <Button
              key={i}
              onClick={() => {
                goToPage(i + 1);
              }}
              title={`${i + 1}`}
              active={selectedPage === i}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default SearchPagination;
