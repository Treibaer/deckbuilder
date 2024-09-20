import { useLoaderData } from "react-router-dom";
import MatchService from "../Services/MatchService";
import { User } from "../models/dtos";

const Users = () => {
  const users = useLoaderData() as User[];

  return (
    <div>
      <div className="text-4xl">Users</div>
      <div className="flex gap-2 my-2">
        {users.map((user) => (
          <div
            key={user.id}
            className="user-card flex items-center p-3 mb-3 cursor-pointer border border-[#ddd] rounded-lg transition-all duration-300  hover:text-[#333] hover:bg-[#f9f9f9]"
          >
            <div className="user-info">
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
