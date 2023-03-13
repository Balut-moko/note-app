import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  Stack,
} from "@chakra-ui/react";

import { DataCardList } from "./components/DataCardList";
import { OpenUpsertFormModalButton } from "./components/OpenUpsertFormModalButton";
import { ReadFilter } from "./components/ReadFilter";
import { SearchBox } from "./components/SearchBox";
import { StarFilter } from "./components/StarFilter";
import { UserIdInput } from "./components/UserIdInput";
import { useHandleCards } from "./hooks/useHandleCards";

export const App = () => {
  const [
    userId,
    searchBoxText,
    filteredCards,
    {
      handleUserId,
      handleReadFilter,
      handleStarFilter,
      handleSearchBoxText,
      handleAllUnreadFlags,
      handleUnreadFlag,
      handleStarFlag,
      handleUpdateCards,
    },
  ] = useHandleCards();

  return (
    <>
      <Box bgColor="whitesmoke" height="100%">
        <Flex height="50px" alignItems="center" bgColor="teal.500">
          <Heading fontSize="3xl" padding="2">
            NoteApp
          </Heading>
          <Spacer />
          <UserIdInput handleUserId={handleUserId} />
        </Flex>
        <Box height="88px" padding="2">
          <HStack outline="teal solid 2px" padding="2">
            <Stack>
              <ReadFilter onChange={handleReadFilter} />
              <StarFilter onChange={handleStarFilter} />
            </Stack>
            <Spacer />
            <SearchBox
              searchBoxText={searchBoxText}
              handleSearchBoxText={handleSearchBoxText}
            />
            <Spacer />
            <Stack direction="row">
              <OpenUpsertFormModalButton
                userId={userId}
                handleUpdateCards={handleUpdateCards}
              />
              <Button
                rightIcon={<CheckIcon />}
                size="sm"
                colorScheme="teal"
                variant="solid"
                onClick={() => handleAllUnreadFlags()}
                disabled={userId === 0}
              >
                一括既読
              </Button>
            </Stack>
          </HStack>
        </Box>
        <Box borderRadius="sm" height="calc(100% - 150px)">
          <DataCardList
            userId={userId}
            searchBoxText={searchBoxText}
            DataCards={filteredCards}
            handleUnreadFlag={handleUnreadFlag}
            handleStarFlag={handleStarFlag}
            handleUpdateCards={handleUpdateCards}
          />
        </Box>
      </Box>
    </>
  );
};
