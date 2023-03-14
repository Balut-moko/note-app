import {
  Box,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { CloseIcon, SearchIcon } from "@chakra-ui/icons";

type Props = {
  searchBoxText: string;
  setSearchBoxText: (value: React.SetStateAction<string>) => void;
};

export const SearchBox: React.FC<Props> = ({
  searchBoxText,
  setSearchBoxText,
}) => {
  return (
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
  );
};
