import { useEffect, useState } from "react";
import "./LoadingSpinner.css";
import FullscreenLoadingSpinner from "./FullscreenLoadingSpinner";

export const DelayedLoadingSpinner = () => {
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowSpinner(true), 300);

    return () => clearTimeout(timer);
  }, []);

  return showSpinner ? <FullscreenLoadingSpinner /> : null;
};

export default DelayedLoadingSpinner;