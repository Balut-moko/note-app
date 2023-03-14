import { Box, Flex, Heading, HStack, Spacer, Stack } from "@chakra-ui/react";
import { useState } from "react";

import { DataCardList } from "./components/DataCardList";
import { ReadFilter } from "./components/ReadFilter";
import { SearchBox } from "./components/SearchBox";
import { StarFilter } from "./components/StarFilter";
import { UserIdInput } from "./components/UserIdInput";
import * as user from "./types/user";

export const App = () => {
  const [userId, setUserId] = useState<number>(0);
  const [readFilter, setReadFilter] = useState<user.ReadFilter>("all");
  const [starFilter, setStarFilter] = useState<user.StarFilter>("all");
  const [searchBoxText, setSearchBoxText] = useState("");

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
              <ReadFilter setReadFilter={setReadFilter} />
              <StarFilter setStarFilter={setStarFilter} />
            </Stack>
            <Spacer />
            <SearchBox
              searchBoxText={searchBoxText}
              setSearchBoxText={setSearchBoxText}
            />
            <Spacer />
          </HStack>
        </Box>
        <Box borderRadius="sm" height="calc(100% - 150px)">
          <DataCardList
            userId={userId}
            readFilter={readFilter}
            starFilter={starFilter}
            searchBoxText={searchBoxText}
          />
        </Box>
      </Box>
    </>
  );
};
