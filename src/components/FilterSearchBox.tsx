import { useState, useEffect } from "react";
import { Box, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

type Props = {
  setSearchBoxText: React.Dispatch<React.SetStateAction<string>>;
};

export const FilterSearchBox: React.FC<Props> = ({ setSearchBoxText }) => {
  const [formText, setFormText] = useState("");

  // useEffect(() => {
  //   setSearchBoxText(formText);
  // }, [formText]);

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
          value={formText}
          onChange={(event) => setFormText(event.target.value)}
          onKeyPress={(e) => {
            if (e.key == "Enter") {
              setSearchBoxText(formText);
            }
          }}
        />
      </InputGroup>
    </Box>
  );
};
