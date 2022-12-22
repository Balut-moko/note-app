import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";

export const useGetUserName = (userId: number) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    (async () => {
      const user_name = await invoke<string>("get_user_name", {
        userId: userId,
      }).catch((err) => {
        console.error(err);
        alert("該当するユーザーがいません。");
        return "";
      });
      setUserName(user_name);
    })();
  }, [userId]);

  return [userName];
};
