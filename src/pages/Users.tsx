import { useLoaderData } from "react-router-dom";
import MatchService from "../Services/MatchService";
import "./Users.css";
import { User } from "../models/dtos";

const Users = () => {
  const users = useLoaderData() as User[];

  return (
    <div>
      <h1>Users</h1>
      <div id="usersList">
        {users.map((user) => (
          <div className="user-card">
            <div key={user.id} className="user-info">
              <h2>{user.username}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const loader = async () => {
  return await MatchService.shared.getUsers();
};

export default Users;
