import { IconButton } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { UpsertFormModal } from "./UpsertFormModal";
import { useModalDisclosure } from "../hooks/useModalDisclosure";
import * as user from "../types/user";

type Props = {
  userId: number;
  cardData: user.TCard;
  handleUpdateCards: (updateCard: user.TCard) => void;
};

export const OpenUpsertFormModalIconButton: React.FC<Props> = ({
  userId,
  cardData,
  handleUpdateCards,
}) => {
  const { isOpen, onOpen, onClose, onSubmit } = useModalDisclosure(
    userId,
    handleUpdateCards
  );

  return (
    <>
      <IconButton
        size="md"
        fontSize="md"
        variant="ghost"
        aria-label="Star card"
        icon={<EditIcon />}
        onClick={() => onOpen()}
      />
      {isOpen && (
        <UpsertFormModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={onSubmit}
          card={cardData}
        />
      )}
    </>
  );
};
