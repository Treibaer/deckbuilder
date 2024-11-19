import { useEffect, useRef, useState } from "react";
import Constants from "../Services/Constants";
import FullscreenLoadingSpinner from "../components/Common/FullscreenLoadingSpinner";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Register: React.FC = () => {
  const [user, setUser] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  async function handleLogin() {
    setIsSubmitting(true);
    setError("");

    // wait 300ms
    await new Promise((resolve) => setTimeout(resolve, 300));

    const response = await fetch(`${Constants.backendUrl}/api/v1/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: user.username,
        password: user.password,
        confirmPassword: user.confirmPassword,
        client: "deckbuilder",
      }),
    });
    const data = await response.json();

    if (response.ok && data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      navigate("/");
    } else {
      setError(data.message ?? "Invalid credentials");
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
      <Helmet title="Register" />
      {isSubmitting && <FullscreenLoadingSpinner />}
      <div className="flex flex-col gap-2 w-[calc(100vw-16px)] border border-lightBlue max-w-[500px] sm:max-w-[500px] md:max-w-[600px] p-2 rounded shadow-lg absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
        <h1 className="mb-4">Register</h1>
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
          placeholder="Username"
          autoComplete="new-password"
          onChange={(event) =>
            setUser((prevUser) => ({
              ...prevUser,
              username: event.target.value,
            }))
          }
          onKeyDown={handleKeyDown}
        />
        <input
          className="tb-input"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          onChange={(event) =>
            setUser((prevUser) => ({
              ...prevUser,
              password: event.target.value,
            }))
          }
          onKeyDown={handleKeyDown}
        />
        <input
          className="tb-input mb-10"
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          onChange={(event) =>
            setUser((prevUser) => ({
              ...prevUser,
              confirmPassword: event.target.value,
            }))
          }
          onKeyDown={handleKeyDown}
        />
        <Button title="Register" onClick={handleLogin} />
      </div>
    </div>
  );
};

export default Register;
