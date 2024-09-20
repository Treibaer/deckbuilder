import { useState } from "react";
import Constants from "../Services/Constants";
import Button from "./Button";

const LoginView: React.FC<{
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}> = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    setIsSubmitting(true);
    setError("");

    const response = await fetch(`${Constants.backendUrl}/api/v1/login`, {
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

    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
    } else {
      setError("Invalid credentials");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Email"
        onChange={(event) => setEmail(event.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(event) => setPassword(event.target.value)}
      />
      <Button title="Login" onClick={handleLogin} disabled={isSubmitting} />
      {error && <p>{error}</p>}
    </>
  );
};

export default LoginView;
