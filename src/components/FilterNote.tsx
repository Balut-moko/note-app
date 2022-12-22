import { useState } from "react";
import { FilterConfig } from "./FilterConfig";
import { FilterSearchBox } from "./FilterSearchBox";
import { useGetUserFilteredNote } from "../hooks/useGetUserFilteredNote";
import { Note } from "./Note";
import { Box, HStack, Stack, Button, Spacer } from "@chakra-ui/react";
import { AddIcon, CheckIcon } from "@chakra-ui/icons";

type Props = {
  userId: number;
};

export const FilterNote: React.FC<Props> = ({ userId }) => {
  const [starFilterFlags, setStarFilterFlags] = useState([true, true]);
  const [readFilterFlags, setReadFilterFlags] = useState([true, true]);
  const [searchBoxText, setSearchBoxText] = useState("");

  const [userFilteredNote] = useGetUserFilteredNote(
    userId,
    starFilterFlags,
    readFilterFlags,
    searchBoxText
  );

  return (
    <Box borderRadius="sm">
      <HStack spacing="24px" outline="teal solid 2px" margin="3" padding="3">
        <FilterConfig
          title="スター"
          firstItem="あり"
          secondItem="なし"
          setCheckedItemsState={setStarFilterFlags}
        />
        <FilterConfig
          title="未読・既読"
          firstItem="未読"
          secondItem="既読"
          setCheckedItemsState={setReadFilterFlags}
        />
        <FilterSearchBox setSearchBoxText={setSearchBoxText} />
        <Spacer />
        <Stack>
          <Button rightIcon={<AddIcon />} colorScheme="teal" variant="outline">
            新規作成
          </Button>
          <Button rightIcon={<CheckIcon />} colorScheme="teal" variant="solid">
            一括既読
          </Button>
        </Stack>
      </HStack>
      <Note userNote={userFilteredNote} />;
    </Box>
  );
};
