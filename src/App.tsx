import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import {
  Box,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";

import { DataCardList } from "./components/DataCardList";
import { UserIdInput } from "./components/UserIdInput";
import * as user from "./types/user";

export const App = () => {
  const [userId, setUserId] = useState<number>(0);
  const [users, setUsers] = useState<user.TUser[]>([]);

  const [readFilter, setReadFilter] = useState<user.ReadFilter>("all");
  const [starFilter, setStarFilter] = useState<user.StarFilter>("all");

  const [searchBoxText, setSearchBoxText] = useState("");

  const { isOpen, onOpen, onClose } = useDisclosure();

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

  return (
    <>
      <Box bgColor="whitesmoke" height="100%">
        <Flex height="50px" alignItems="center" bgColor="teal.500">
          <Heading fontSize="3xl" padding="2">
            NoteApp
          </Heading>
          <Spacer />
          <UserIdInput setUserId={setUserId} />
        </Flex>
        <Box height="100px" padding="2">
          <HStack outline="teal solid 2px" padding="2">
            <Stack>
              <HStack>
                <Heading size="xs">既読</Heading>
                <Spacer />
                <RadioGroup
                  defaultValue="all"
                  colorScheme="teal"
                  onChange={(value) => setReadFilter(value as user.ReadFilter)}
                >
                  <Stack direction="row">
                    <Radio value="all">全て</Radio>
                    <Radio value="unread">未読</Radio>
                    <Radio value="read">既読</Radio>
                  </Stack>
                </RadioGroup>
              </HStack>
              <HStack>
                <Heading size="xs">スター</Heading>
                <Spacer />
                <RadioGroup
                  defaultValue="all"
                  colorScheme="teal"
                  onChange={(value) => setStarFilter(value as user.StarFilter)}
                >
                  <Stack direction="row">
                    <Radio value="all">全て</Radio>
                    <Radio value="starred">あり</Radio>
                    <Radio value="unStarred">なし</Radio>
                  </Stack>
                </RadioGroup>
              </HStack>
            </Stack>
            <Spacer />
            <Box>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<SearchIcon color="gray.500" />}
                />
                <Input
                  borderColor="teal.500"
                  focusBorderColor="teal.500"
                  placeholder="Search Words"
                  value={searchBoxText}
                  onChange={(e) => setSearchBoxText(e.target.value)}
                />
                <InputRightElement>
                  <IconButton
                    size="xs"
                    color={searchBoxText ? "black" : "gray.500"}
                    variant="ghost"
                    aria-label="delete"
                    icon={<CloseIcon />}
                    onClick={() => setSearchBoxText("")}
                  />
                </InputRightElement>
              </InputGroup>
            </Box>
            <Spacer />
          </HStack>
        </Box>
        <DataCardList
          userId={userId}
          readFilter={readFilter}
          starFilter={starFilter}
          searchBoxText={searchBoxText}
        />
      </Box>
    </>
  );
};
