import { useState, useEffect } from "react";
import { Box, Checkbox, Stack } from "@chakra-ui/react";

type CheckboxProps = {
  title: string;
  firstItem: string;
  secondItem: string;
  setCheckedItemsState: React.Dispatch<React.SetStateAction<boolean[]>>;
};

export const FilterConfig = (props: CheckboxProps) => {
  const { title, firstItem, secondItem, setCheckedItemsState } = props;

  const [checkedItems, setCheckedItems] = useState([true, true]);
  const allChecked = checkedItems.every(Boolean);
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;

  useEffect(() => {
    setCheckedItemsState(checkedItems);
  }, [checkedItems]);

  return (
    <Box>
      <Checkbox
        colorScheme="teal"
        isChecked={allChecked}
        isIndeterminate={isIndeterminate}
        onChange={(e) => setCheckedItems([e.target.checked, e.target.checked])}
      >
        {title}
      </Checkbox>
      <Stack pl={6} mt={1} spacing={1}>
        <Checkbox
          colorScheme="teal"
          isChecked={checkedItems[0]}
          onChange={(e) => setCheckedItems([e.target.checked, checkedItems[1]])}
        >
          {firstItem}
        </Checkbox>
        <Checkbox
          colorScheme="teal"
          isChecked={checkedItems[1]}
          onChange={(e) => setCheckedItems([checkedItems[0], e.target.checked])}
        >
          {secondItem}
        </Checkbox>
      </Stack>
    </Box>
  );
};
