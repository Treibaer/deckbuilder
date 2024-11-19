import { useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";

function DeckPlaytestPage() {
  const { playtestId } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [iframeRef.current]);

  return (
    <>
      <Helmet title="Playtest" />
      <iframe
        className="fixed inset-0 w-screen h-screen"
        src={`/magic-web-js/play.html?matchId=${playtestId}`}
        title="Play Page"
        ref={iframeRef}
      ></iframe>
    </>
  );
}

export default DeckPlaytestPage;
