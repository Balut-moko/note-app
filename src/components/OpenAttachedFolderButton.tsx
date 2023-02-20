import { IconButton } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { invoke } from "@tauri-apps/api";
import { resourceDir } from "@tauri-apps/api/path";

type Props = {
  card_id: number;
};

async function handleButtonClick(
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  card_id: number
) {
  event.stopPropagation();
  const resourceDirPath = await resourceDir();
  await invoke("show_in_folder", { path: resourceDirPath, cardId: card_id });
}

export const OpenAttachedFolderButton: React.FC<Props> = ({ card_id }) => {
  return (
    <IconButton
      size="md"
      fontSize="2xl"
      variant="ghost"
      colorScheme="teal"
      aria-label="Star note"
      icon={<ExternalLinkIcon />}
      onClick={(event) => handleButtonClick(event, card_id)}
    />
  );
};
