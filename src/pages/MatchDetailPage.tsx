import { useParams } from "react-router-dom";

function MatchDetailPage() {
  const { matchId } = useParams();

  return (
    <iframe
      className="absolute inset-0 w-screen h-screen"
      src={`/magic-web-js/duo3.html?matchId=${matchId}`}
      title="Match"
    ></iframe>
  );
}

export default MatchDetailPage;
