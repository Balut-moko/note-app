import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Spacer,
  Text,
} from "@chakra-ui/react";

import { EditIcon, StarIcon } from "@chakra-ui/icons";
import { OpenAttachedFolderButton } from "./OpenAttachedFolderButton";

import { formatDateString } from "../utils/formatDate";
import * as user from "../types/user";

type Props = {
  userId: number;
  data: user.TCard;
  handleStarFlag: (id: number, starred: boolean) => void;
  handleUnreadFlag: (id: number, unread: boolean) => void;
};

export const DataCard: React.FC<Props> = ({
  userId,
  data,
  handleStarFlag,
  handleUnreadFlag,
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
          <IconButton
            size="md"
            fontSize="md"
            variant="ghost"
            aria-label="Star card"
            icon={<EditIcon />}
            // onClick={() => {
            //   handleOpenModal(card);
            // }}
          />
          <OpenAttachedFolderButton card_id={data.id} />
        </Flex>
      </CardHeader>
      <CardBody padding="1">
        <Text fontSize="sm" whiteSpace="pre-line">
          {data.content}
        </Text>
      </CardBody>
    </Card>
  );
};
