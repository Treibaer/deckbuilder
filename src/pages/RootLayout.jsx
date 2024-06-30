import { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import LoadingSpinner from "../components/Common/LoadingSpinner";
import MainNavigation from "../components/MainNavigation";
import LoginView from "./LoginView";

export default function RootLayout() {
  const navigation = useNavigation();
  const [checkingLogin, setCheckingLogin] = useState(true);
  // const isLoggedIn = localStorage.getItem("token") !== null;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      if (!localStorage.getItem("token")) {
        setIsLoggedIn(false);
        setCheckingLogin(false);
        return;
      }

      const result = await fetch("https://mac.treibaer.de/api/v2/app", {
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
        setIsLoggedIn(data.allowed);
        setCheckingLogin(false);
      }
    }
    checkLogin();
  }, []);

  return (
    <>
      {navigation.state === "loading" && <DelayedLoadingView />}
      {isLoggedIn && (
        <>
          <MainNavigation />
          <main className="container">
            <Outlet />
          </main>
        </>
      )}
      {!isLoggedIn && !checkingLogin && (
        <LoginView setIsLoggedIn={setIsLoggedIn} />
      )}
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
