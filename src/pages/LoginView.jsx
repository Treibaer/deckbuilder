import { useState } from "react";
import Constants from "../Services/Constants";

export default function LoginView({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin(event) {
    event.preventDefault();
    setIsSubmitting(true);

    const response = await fetch(`${Constants.loginApiHost}/api/v1/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
        client: "tb-react",
      }),
    });
    const data = await response.json();
    console.log(data);
    if (response.ok && data.token) {
      localStorage.setItem("token", data.token);
      setIsLoggedIn(true);
    }
  }
  return (
    <div>
      <h1>Login</h1>
      <form>
        <input
          type="text"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(event) => setPassword(event.target.value)}
        />
        <button onClick={handleLogin} disabled={isSubmitting ? "disabled": undefined}>Login</button>
      </form>
    </div>
  );
}
