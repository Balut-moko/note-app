import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  Highlight,
  IconButton,
  Spacer,
  Text,
} from "@chakra-ui/react";

import { StarIcon } from "@chakra-ui/icons";
import { OpenAttachedFolderButton } from "./OpenAttachedFolderButton";

import { formatDateString } from "../utils/formatDate";
import * as user from "../types/user";
import { OpenUpsertFormModalIconButton } from "./OpenUpsertFormModalIconButton";

type Props = {
  userId: number;
  data: user.TCard;
  highlightText: string;
  handleStarFlag: (id: number, starred: boolean) => void;
  handleUnreadFlag: (id: number, unread: boolean) => void;
  handleUpdateCards: (updateCard: user.TCard) => void;
};

export const DataCard: React.FC<Props> = ({
  userId,
  data,
  highlightText,
  handleStarFlag,
  handleUnreadFlag,
  handleUpdateCards,
}) => {
  return (
    <Card bgColor="gray.300" key={data.id} margin="3">
      <CardHeader padding="0">
        <Flex flex="1" alignItems="stretch" flexWrap="wrap">
          <Heading size="xs" padding="3">
            {formatDateString(data.updated, "yyyy-MM-dd")}
          </Heading>
          {userId == 0 ? null : (
            <IconButton
              size="md"
              fontSize="xl"
              variant="ghost"
              color={data.starred ? "yellow.500" : "gray.400"}
              aria-label="update_card"
              icon={<StarIcon />}
              onClick={() => handleStarFlag(data.id, data.starred)}
            />
          )}
          {userId == 0 ? null : (
            <Button
              variant="ghost"
              textColor={data.unread ? "red.500" : "gray.400"}
              onClick={() => handleUnreadFlag(data.id, data.unread)}
            >
              {data.unread ? "未読" : "既読"}
            </Button>
          )}
          <Spacer />
          <OpenUpsertFormModalIconButton
            userId={userId}
            cardData={data}
            handleUpdateCards={handleUpdateCards}
          />
          <OpenAttachedFolderButton card_id={data.id} />
        </Flex>
      </CardHeader>
      <CardBody padding="1">
        <Text fontSize="sm" whiteSpace="pre-line">
          <Highlight
            query={highlightText}
            styles={{ px: "1", py: "0,5", rounded: "full", bg: "red.100" }}
          >
            {data.content}
          </Highlight>
        </Text>
      </CardBody>
    </Card>
  );
};
