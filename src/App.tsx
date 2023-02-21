import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { useForm } from "react-hook-form";

import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  EditIcon,
  SearchIcon,
  StarIcon,
} from "@chakra-ui/icons";

import { OpenAttachedFolderButton } from "./components/OpenAttachedFolderButton";
import { AutoResizeTextarea } from "./components/AutoResizeTextarea";
import { formatDate } from "./utils/formatDate";

import * as user from "./types/user";

type ReadFilter = "all" | "read" | "unread" | "None";
type StarFilter = "all" | "starred" | "unStarred" | "None";

export const App = () => {
  const [formText, setFormText] = useState("");
  const [userId, setUserId] = useState<number>(0);
  const [userName, setUserName] = useState("");
  const [users, setUsers] = useState<user.TUser[]>([]);

  const [readFilter, setReadFilter] = useState<ReadFilter>("all");
  const [starFilter, setStarFilter] = useState<StarFilter>("all");

  const [searchBoxText, setSearchBoxText] = useState("");

  const [cards, setCards] = useState<user.TCard[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  useEffect(() => {
    (async () => {
      const user_name = await invoke<string>("get_user_name", {
        userId: userId,
      }).catch((err) => {
        console.error(err);
        alert("該当するユーザーがいません。");
        setUserId(0);
        setFormText("");
        return "";
      });

      setUserName(user_name);
    })();
  }, [userId]);

  useEffect(() => {
    (async () => {
      const cards = await invoke<user.TCard[]>("get_cards", {
        userId: userId,
      }).catch((err) => {
        console.error(err);
        return [];
      });

      setCards(cards);
    })();
  }, [userId]);

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

  const onChangeHandler = (value: string) => {
    const v = value.replace(/[０-９．]/g, (s) =>
      String.fromCharCode(s.charCodeAt(0) - 0xfee0)
    );
    if (!isNaN(Number(v))) {
      setFormText(v);
    }
  };

  const handleAllUnreadFlags = () => {
    const deepCopy = cards.map((card) => ({ ...card }));
    const newCards = deepCopy.map((card) => {
      card.unread = false;
      return card;
    });
    (async () => {
      await invoke<void>("handle_delete_all_unread_flags", {
        userId: userId,
      });
    })();

    setCards(newCards);
  };

  const handleUnreadFlag = (id: number, unread: boolean) => {
    const deepCopy = cards.map((card) => ({ ...card }));
    const newCards = deepCopy.map((card) => {
      if (card.id === id) {
        (async () => {
          await invoke<void>("handle_flags", {
            table: "unread_card",
            method: unread ? "delete" : "insert",
            cardId: card.id,
            userId: userId,
          });
        })();

        card.unread = !unread;
      }
      return card;
    });
    setCards(newCards);
  };

  const handleStarFlag = (id: number, starred: boolean) => {
    const deepCopy = cards.map((card) => ({ ...card }));
    const newCards = deepCopy.map((card) => {
      if (card.id === id) {
        (async () => {
          await invoke<void>("handle_flags", {
            table: "star_card",
            method: starred ? "delete" : "insert",
            cardId: card.id,
            userId: userId,
          });
        })();

        card.starred = !starred;
      }
      return card;
    });
    setCards(newCards);
  };

  const filteredCards = cards
    .filter((card) => {
      switch (readFilter) {
        case "all":
          return card;
        case "read":
          return !card.unread;
        case "unread":
          return card.unread;
        default:
          return false;
      }
    })
    .filter((card) => {
      switch (starFilter) {
        case "all":
          return card;
        case "starred":
          return card.starred;
        case "unStarred":
          return !card.starred;
        default:
          return false;
      }
    })
    .filter((card) => {
      return card.content.match(searchBoxText);
    });

  return (
    <>
      <Box bgColor="gray.100" position="sticky" zIndex={"sticky"} top={0}>
        <Flex
          as="header"
          justifyItems="center"
          alignItems="center"
          bgColor="teal"
        >
          <Heading fontSize="3xl" padding="2">
            NoteApp
          </Heading>
          <InputGroup>
            <InputLeftAddon children="User ID" />
            <Input
              name="UserID"
              htmlSize={4}
              width="auto"
              type="text"
              placeholder="User ID"
              value={formText}
              onChange={(event) => onChangeHandler(event.target.value)}
              onKeyPress={(e) => {
                if (e.key == "Enter") {
                  setUserId(Number(formText));
                }
              }}
            />
            <Text padding="2">{userName}</Text>
          </InputGroup>
        </Flex>
      </Box>

      <Box borderRadius="sm">
        <HStack spacing="24px" outline="teal solid 2px" margin="3" padding="3">
          <Stack>
            <Heading size="xs">既読</Heading>
            <RadioGroup
              defaultValue="all"
              colorScheme="teal"
              onChange={(value) => setReadFilter(value as ReadFilter)}
            >
              <Stack direction="row">
                <Radio value="all">全て</Radio>
                <Radio value="unread">未読</Radio>
                <Radio value="read">既読</Radio>
              </Stack>
            </RadioGroup>
            <Heading size="xs">スター</Heading>
            <RadioGroup
              defaultValue="all"
              colorScheme="teal"
              onChange={(value) => setStarFilter(value as StarFilter)}
            >
              <Stack direction="row">
                <Radio value="all">全て</Radio>
                <Radio value="starred">あり</Radio>
                <Radio value="unStarred">なし</Radio>
              </Stack>
            </RadioGroup>
          </Stack>
          <Spacer />
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
          <Spacer />
          <Stack>
            <Button
              rightIcon={<AddIcon />}
              colorScheme="teal"
              variant="outline"
              onClick={() => handleOpenModal(null)}
            >
              新規作成
            </Button>
            <Button
              rightIcon={<CheckIcon />}
              colorScheme="teal"
              variant="solid"
              onClick={() => handleAllUnreadFlags()}
            >
              一括既読
            </Button>
          </Stack>
        </HStack>
        <Stack padding="2">
          {filteredCards.map((card: user.TCard) => {
            return (
              <Card bgColor="gray.100" key={card.id}>
                <CardHeader padding="2">
                  <Flex flex="1" alignItems="stretch" flexWrap="wrap">
                    <Heading size="xs" padding="3">
                      {formatDate(new Date(card.updated), "yyyy-MM-dd")}
                    </Heading>
                    {userId == 0 ? null : (
                      <IconButton
                        size="md"
                        fontSize="2xl"
                        variant="ghost"
                        color={card.starred ? "yellow.500" : "gray.300"}
                        aria-label="update_card"
                        icon={<StarIcon />}
                        onClick={() => handleStarFlag(card.id, card.starred)}
                      />
                    )}
                    {userId == 0 ? null : (
                      <Button
                        padding="2"
                        textColor={card.unread ? "red.500" : "gray.400"}
                        onClick={() => handleUnreadFlag(card.id, card.unread)}
                      >
                        {card.unread ? "未読" : "既読"}
                      </Button>
                    )}
                    <Spacer />
                    <IconButton
                      size="md"
                      fontSize="md"
                      variant="ghost"
                      aria-label="Star card"
                      icon={<EditIcon />}
                      onClick={() => {
                        handleOpenModal(card);
                      }}
                    />
                    <OpenAttachedFolderButton card_id={card.id} />
                  </Flex>
                </CardHeader>
                <CardBody padding="2">
                  <Text fontSize="lg" whiteSpace="pre-line">
                    {card.content}
                  </Text>
                </CardBody>
              </Card>
            );
          })}
        </Stack>
      </Box>
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
    </>
  );
};
