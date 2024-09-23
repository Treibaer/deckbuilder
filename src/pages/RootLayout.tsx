import { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import FullscreenLoadingSpinner from "../components/Common/FullscreenLoadingSpinner";
import LoginView from "../components/LoginView";
import MainNavigation from "../components/Navigation/MainNavigation";
import Constants from "../Services/Constants";

const RootLayout = () => {
  const navigation = useNavigation();
  const [checkingLogin, setCheckingLogin] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lastImportCards, setLastImportCards] = useState<number | null>(null);

  useEffect(() => {
    async function checkLogin() {
      if (!localStorage.getItem("token")) {
        setIsLoggedIn(false);
        setCheckingLogin(false);
        return;
      }

      const result = await fetch(`${Constants.newBackendUrl}/api/v1/app`, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (result.status === 401) {
        setIsLoggedIn(false);
        setCheckingLogin(false);
      } else {
        const data = await result.json();
        setLastImportCards(data.lastImportCards);
        setIsLoggedIn(data.allowed);
        setCheckingLogin(false);
      }
    }
    checkLogin();
  }, [isLoggedIn]);

  // check how many seconds ago the last import was
  const lastImportSecondsAgo = lastImportCards
    ? Math.floor(Date.now() / 1000) - lastImportCards
    : null;

  const shouldImport =
    lastImportSecondsAgo === null || lastImportSecondsAgo > 60 * 60 * 24 * 3;

  return (
    <>
      {navigation.state === "loading" && <DelayedLoadingView />}
      {isLoggedIn && (
        <main className="flex flex-col relative">
          {shouldImport && (
            <div className="absolute right-2 top-2 text-red-400">
              {lastImportSecondsAgo === null
                ? "Never imported"
                : `Last import: ${Math.floor(
                    lastImportSecondsAgo / 60 / 60 / 24
                  )} days ago`}
            </div>
          )}
          <MainNavigation />
          <div className="flex flex-col">
            <Outlet />
          </div>
        </main>
      )}
      {!isLoggedIn && !checkingLogin && (
        <LoginView setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  );
};

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

  return <FullscreenLoadingSpinner />;
}

export default RootLayout;
