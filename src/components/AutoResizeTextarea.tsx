import { forwardRef } from "react";
import { Textarea, TextareaProps } from "@chakra-ui/react";

import ResizeTextarea from "react-textarea-autosize";

export const AutoResizeTextarea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>((props, ref) => {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref}
      minRows={3}
      as={ResizeTextarea}
      {...props}
    />
  );
});
