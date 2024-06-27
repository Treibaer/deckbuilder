import { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MainNavigation from "../components/MainNavigation";

export default function RootLayout() {
  const navigation = useNavigation();
  return (
    <>
      {navigation.state === "loading" && <DelayedLoadingView />}
      <MainNavigation />
      <main className="container">
        <Outlet />
      </main>
    </>
  );
}

function DelayedLoadingView() {
  const [isWaiting, setIsWaiting] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsWaiting(false);
    }, 300);
  }, []);

  if (isWaiting) {
    return <></>;
  }

  return (
    <div className="fullscreenBlurWithLoading">
      <LoadingSpinner />
    </div>
  );
}
