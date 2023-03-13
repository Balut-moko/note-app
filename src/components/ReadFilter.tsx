import {
  Heading,
  HStack,
  Radio,
  RadioGroup,
  Spacer,
  Stack,
} from "@chakra-ui/react";

type Props = {
  onChange: (value: string) => void;
};

export const ReadFilter: React.FC<Props> = ({ onChange }) => {
  return (
    <HStack>
      <Heading size="xs">既読</Heading>
      <Spacer />
      <RadioGroup defaultValue="all" colorScheme="teal" onChange={onChange}>
        <Stack direction="row">
          <Radio value="all">全て</Radio>
          <Radio value="unread">未読</Radio>
          <Radio value="read">既読</Radio>
        </Stack>
      </RadioGroup>
    </HStack>
  );
};
