import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";

import { Input, InputGroup, InputRightAddon } from "@chakra-ui/react";

import * as user from "../types/user";

type Props = {
  handleUserId: (num: number) => void;
};

export const UserIdInput: React.FC<Props> = ({
  handleUserId: handleUserId,
}) => {
  const [formText, setFormText] = useState("");
  const [userName, setUserName] = useState("");

  const onChangeHandler = (value: string) => {
    const v = value.replace(/[０-９．]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    if (!isNaN(Number(v))) {
      setFormText(v);
    }
  };

  const onKeyPressHandler = (key: string) => {
    if (key == "Enter") {
      handleUserId(Number(formText));
      (async () => {
        const user_name = await invoke<string>("get_user_name", {
          userId: Number(formText),
        }).catch((err) => {
          console.error(err);
          alert("該当するユーザーがいません。");
          handleUserId(0);
          setFormText("");
          return "";
        });

        setUserName(user_name);
      })();
    }
  };

  return (
    <InputGroup margin="3" justifyContent="right">
      <Input
        name="UserID"
        bgColor="whitesmoke"
        borderColor="gray.300"
        focusBorderColor="gray.300"
        htmlSize={4}
        width="auto"
        type="text"
        placeholder="User ID"
        value={formText}
        onChange={(event) => onChangeHandler(event.target.value)}
        onKeyPress={(e) => onKeyPressHandler(e.key)}
      />
      <InputRightAddon width="40" bgColor="gray.300" children={userName} />
    </InputGroup>
  );
};
