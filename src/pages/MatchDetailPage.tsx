import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

function MatchDetailPage() {
  const { matchId } = useParams();

  return (
    <>
      <Helmet title="Match" />
      <iframe
        className="fixed inset-0 w-screen h-screen"
        src={`/magic-web-js/duo3.html?matchId=${matchId}`}
        title="Match"
      ></iframe>
    </>
  );
}

export default MatchDetailPage;
