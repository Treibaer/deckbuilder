import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

function PlayPage() {
  const { matchId } = useParams();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.focus();
    }
  }, [iframeRef.current]);

  return (
    <iframe
      className="absolute inset-0 w-screen h-screen"
      src={`/magic-web-js/play.html?matchId=${matchId}`}
      title="Play Page"
      ref={iframeRef}
    ></iframe>
  );
}

export default PlayPage;
