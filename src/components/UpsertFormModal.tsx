import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";
import { AutoResizeTextarea } from "./AutoResizeTextarea";
import * as user from "../types/user";
import { useForm } from "react-hook-form";
import { formatDate } from "../utils/formatDate";

const { isOpen, onOpen, onClose } = useDisclosure();

const {
  handleSubmit,
  register,
  setValue,
  formState: { errors, isSubmitting },
} = useForm<user.formData>();

const handleOpenModal = (card: user.TCard | null) => {
  setValue("card_id", card ? card.id : null);
  setValue("content", card ? card.content : "");
  setValue("updated", formatDate(new Date(), "yyyy-MM-dd HH:mm"));
  onOpen();
};
const onSubmit = (data: user.formData) => {
  console.log(data);
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
        const newCards = cards.filter((card) => card.id !== updateCard.id);
        setCards([updateCard, ...newCards]);
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
      if (!!newCard) setCards([newCard, ...cards]);
    })();
  }
  onClose();
};

type Props = {};

export const UpsertFormModal: React.FC<Props> = () => {
  const [users, setUsers] = useState<user.TUser[]>([]);

  useEffect(() => {
    (async () => {
      const users = await invoke<user.TUser[]>("get_users").catch((err) => {
        console.error(err);
        return [];
      });
      const filteredUsers = users.filter((user) => {
        return user.id != 0;
      });
      setUsers(filteredUsers);
    })();
  }, []);

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input type="hidden" id="card_id" {...register("card_id")} />
          <ModalHeader>Create Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody boxSize="-moz-fit-content" pb={6}>
            <FormControl>
              <FormLabel htmlFor="pic_id">発言者</FormLabel>
              <Select
                borderColor="teal.500"
                focusBorderColor="teal.500"
                {...register("pic_id")}
              >
                {users.map((user) => {
                  return (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl isInvalid={!!errors.content}>
              <FormLabel htmlFor="content">発言内容</FormLabel>
              <AutoResizeTextarea
                id="content"
                borderColor="teal.500"
                focusBorderColor="teal.500"
                size="lg"
                {...register("content", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.content && errors.content.message}
              </FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!errors.updated}>
              <FormLabel>作成・更新日時</FormLabel>
              <Input
                type="datetime-local"
                borderColor="teal.500"
                focusBorderColor="teal.500"
                {...register("updated", {
                  required: "This is required",
                })}
              />
              <FormErrorMessage>
                {errors.updated && errors.updated.message}
              </FormErrorMessage>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              isLoading={isSubmitting}
              type="submit"
            >
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};
