import { useLoaderData } from "react-router-dom";
import Client from "../Services/Client";
import "./Users.css";

export default function Users() {
  const users = useLoaderData();

  return (
    <div>
      <h1>Users</h1>
      <div id="usersList">
          {users.map((user) => (
        <div class="user-card">
            <div key={user.id} class="user-info">
              <h2>{user.username}</h2>
            </div>
            </div>
          ))}
      </div>
    </div>
  );
}

export const loader = async () => {
  return await Client.shared.get("/users");
};
