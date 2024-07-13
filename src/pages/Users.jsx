import { useLoaderData } from "react-router-dom";
import Client from "../Services/Client";
import PlayComponent from "../components/PlayComponent";

export default function Users() {
  const users = useLoaderData();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}

export const loader = async () => {
  return await Client.shared.get("/users");
};
