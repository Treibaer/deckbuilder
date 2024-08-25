import { createContext } from "react";

export const UserContext = createContext({});

const UserContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const user = {};
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export default UserContextProvider;
