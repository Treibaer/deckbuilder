import { useEffect, useRef, useState } from "react";
import Constants from "../Services/Constants";
import Button from "./Button";
import FullscreenLoadingSpinner from "./Common/FullscreenLoadingSpinner";

const LoginView: React.FC<{
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleLogin() {
    setIsSubmitting(true);
    setError("");

    // wait 300ms
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = await fetch(`${Constants.newBackendUrl}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
        client: "deckbuilder",
      }),
    });
    const data = await response.json();

    if (response.ok && data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      setIsLoggedIn(true);
    } else {
      setError("Invalid credentials");
      setIsSubmitting(false);
    }
  }

    // Function to handle Enter key press
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (event.key === "Enter") {
        handleLogin();
      }
    };
  

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      {isSubmitting && <FullscreenLoadingSpinner />}

      <div className="flex flex-col gap-2 w-[calc(100vw-16px)] border border-lightBlue max-w-[500px] sm:max-w-[500px] md:max-w-[600px] p-2 rounded shadow-lg absolute top-1/2 sm:top-52 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <h1 className="mb-4">Login</h1>
        <div className="h-10">
          {error && (
            <div className="bg-red-300 p-1 m-1 rounded text-slate-800">
              {error}
            </div>
          )}
        </div>
        <input
          className="tb-input"
          type="text"
          placeholder="Email or username"
          ref={inputRef}
          onChange={(event) => setEmail(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          className="tb-input mb-10"
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button title="Login" onClick={handleLogin} />
      </div>
    </div>
  );
};

export default LoginView;
