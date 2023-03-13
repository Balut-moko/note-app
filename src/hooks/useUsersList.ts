import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";

import * as user from "../types/user";

export const useUsersList = () => {
  const [users, setUsers] = useState<user.TUser[]>([]);

  useEffect(() => {
    (async () => {
      const users = await invoke<user.TUser[]>("get_users").catch((err) => {
        console.error(err);
        return [];
      });
      const filteredUsers = users.filter((user) => {
        return user.id != 0;
      });
      setUsers(filteredUsers);
    })();
  }, []);
  return { users };
};
