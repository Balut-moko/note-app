import { useState, useEffect } from "react";
import { useGetUserName } from "../hooks/useGetUserName";
import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Text,
} from "@chakra-ui/react";

type Props = {
  setUserId: React.Dispatch<React.SetStateAction<number>>;
};

export const Header: React.FC<Props> = ({ setUserId }) => {
  const [formText, setFormText] = useState("");
  const [formUserId, setFormUserId] = useState(0);
  const [userName] = useGetUserName(formUserId);

  useEffect(() => {
    setUserId(formUserId);
  }, [formUserId]);

  return (
    <Box bgColor="gray.100" position="sticky" zIndex={"sticky"} top={0}>
      <Flex
        as="header"
        justifyItems="center"
        alignItems="center"
        bgColor="teal"
      >
        <Heading fontSize="3xl" padding="2">
          NoteApp
        </Heading>
        <InputGroup>
          <InputLeftAddon children="User ID" />
          <Input
            name="UserID"
            htmlSize={4}
            width="auto"
            type="text"
            placeholder="User ID"
            value={formText}
            onChange={(event) => setFormText(event.target.value)}
            onKeyPress={(e) => {
              if (e.key == "Enter") {
                setFormUserId(Number(formText));
              }
            }}
          />
          <Text padding="2">{userName}</Text>
        </InputGroup>
      </Flex>
    </Box>
  );
};
