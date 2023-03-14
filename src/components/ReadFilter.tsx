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
  setReadFilter: (value: React.SetStateAction<user.ReadFilter>) => void;
};

export const ReadFilter: React.FC<Props> = ({ setReadFilter }) => {
  return (
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
  );
};
