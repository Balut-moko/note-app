import {
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
} from "@chakra-ui/react";

import * as user from "../types/user";

type Props = {
  setStarFilter: (value: React.SetStateAction<user.StarFilter>) => void;
};

export const StarFilter: React.FC<Props> = ({ setStarFilter }) => {
  return (
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
  );
};
