import { invoke } from "@tauri-apps/api";
import { useDisclosure } from "@chakra-ui/react";

import * as user from "../types/user";

export const useModalDisclosure = (
  userId: number,
  handleUpdateCards: (updateCard: user.TCard) => void
) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = (data: user.formData) => {
    if (data.card_id) {
      // update
      (async () => {
        const updateCard = await invoke<user.TCard>("handle_update_card", {
          userId: userId,
          cardId: data.card_id,
          content: data.content,
          picId: Number(data.pic_id),
          updated: data.updated,
        }).catch((err) => {
          console.error(err);
          return null;
        });
        if (!!updateCard) {
          handleUpdateCards(updateCard);
        }
      })();
    } else {
      // new create
      (async () => {
        const newCard = await invoke<user.TCard>("handle_insert_card", {
          userId: userId,
          content: data.content,
          picId: Number(data.pic_id),
        }).catch((err) => {
          console.error(err);
          return null;
        });
        if (!!newCard) handleUpdateCards(newCard);
      })();
    }
    onClose();
  };
  return { isOpen, onOpen, onClose, onSubmit };
};
