import { Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { UpsertFormModal } from "./UpsertFormModal";
import { useModalDisclosure } from "../hooks/useModalDisclosure";
import * as user from "../types/user";

type Props = {
  userId: number;
  handleUpdateCards: (updateCard: user.TCard) => void;
};

export const OpenUpsertFormModalButton: React.FC<Props> = ({
  userId,
  handleUpdateCards,
}) => {
  const { isOpen, onOpen, onClose, onSubmit } = useModalDisclosure(
    userId,
    handleUpdateCards
  );
  return (
    <>
      <Button
        rightIcon={<AddIcon />}
        size="sm"
        colorScheme="teal"
        variant="outline"
        onClick={onOpen}
      >
        新規作成
      </Button>
      {isOpen && (
        <UpsertFormModal
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={onSubmit}
        />
      )}
    </>
  );
};
