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

export const StarFilter: React.FC<Props> = ({ onChange }) => {
  return (
    <HStack>
      <Heading size="xs">スター</Heading>
      <Spacer />
      <RadioGroup defaultValue="all" colorScheme="teal" onChange={onChange}>
        <Stack direction="row">
          <Radio value="all">全て</Radio>
          <Radio value="starred">あり</Radio>
          <Radio value="unStarred">なし</Radio>
        </Stack>
      </RadioGroup>
    </HStack>
  );
};
