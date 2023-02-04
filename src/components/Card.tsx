import { useState, useEffect } from "react";
import * as user from "../types/user";

import {
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Text,
  Flex,
  Spacer,
  Heading,
  useBoolean,
} from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { invoke } from "@tauri-apps/api";
import { OpenAttachedFolderButton } from "./OpenAttachedFolderButton";

type Props = {
  userId: number;
  card: user.TCard;
};

async function handleButtonClick(
  event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  card: user.TCard,
  userId: number,
  starFlag: boolean,
  setStarFlag: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  }
) {
  event.stopPropagation();
  await invoke<void>("handle_star_flag", {
    cardId: card.id,
    userId: userId,
    starFlag: starFlag,
  });
  setStarFlag.toggle();
}
async function handleCardClick(
  event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  card: user.TCard,
  userId: number,
  unreadFlag: boolean,
  setUnreadFlag: {
    on: () => void;
    off: () => void;
    toggle: () => void;
  }
) {
  event.stopPropagation();
  await invoke<void>("handle_unread_flag", {
    cardId: card.id,
    userId: userId,
    unreadFlag: unreadFlag,
  });
  setUnreadFlag.toggle();
}

export const DataCard: React.FC<Props> = ({ userId, card }) => {
  const [starFlag, setStarFlag] = useBoolean();
  const [unreadFlag, setUnreadFlag] = useBoolean();

  useEffect(() => {
    card.stared == 1 ? setStarFlag.on() : setStarFlag.off();
  }, [card]);

  useEffect(() => {
    card.unread == 1 ? setUnreadFlag.on() : setUnreadFlag.off();
  }, [card]);

  return (
    <Card
      colorScheme="teal"
      bgColor="gray.100"
      onClick={(event) =>
        handleCardClick(event, card, userId, unreadFlag, setUnreadFlag)
      }
    >
      <CardHeader padding="2">
        <Flex flex="1" alignItems="stretch" flexWrap="wrap">
          <Heading size="xs" padding="3">
            {card.updated}
          </Heading>
          <Spacer />
          {!unreadFlag ? null : (
            <Text size="xs" padding="2" textColor="red">
              "未読"
            </Text>
          )}
          <OpenAttachedFolderButton card_id={card.id} />
          <IconButton
            size="md"
            fontSize="2xl"
            variant="ghost"
            color={starFlag ? "yellow.500" : "gray.300"}
            aria-label="Star note"
            icon={<StarIcon />}
            onClick={(event) =>
              handleButtonClick(event, card, userId, starFlag, setStarFlag)
            }
          />
        </Flex>
      </CardHeader>
      <CardBody padding="2">
        <Text colorScheme="teal" fontSize="lg">
          {card.content}
        </Text>
      </CardBody>
    </Card>
  );
};
