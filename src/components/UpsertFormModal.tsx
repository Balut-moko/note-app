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
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUsersList } from "../hooks/useUsersList";
import * as user from "../types/user";
import { formatDate } from "../utils/formatDate";
import { AutoResizeTextarea } from "./AutoResizeTextarea";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: user.formData) => void;
  card?: user.TCard;
};

export const UpsertFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  card,
}) => {
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<user.formData>();

  useEffect(() => {
    setValue("card_id", card ? card.id : null);
    setValue("content", card ? card.content : "");
    setValue("updated", formatDate(new Date(), "yyyy-MM-dd HH:mm"));
  }, []);

  const { users } = useUsersList();
  console.count();
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
