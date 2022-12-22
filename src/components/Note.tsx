import * as user from "../types/user";

import { Stack } from "@chakra-ui/react";

import { DataCard } from "./Card";

type Props = {
  userNote: user.TNote;
};

export const Note: React.FC<Props> = ({ userNote: user_note }) => {
  const { userId, cards } = user_note;

  return (
    <Stack padding="2">
      {cards.map((card: user.TCard) => {
        return <DataCard key={card.id} card={card} userId={userId} />;
      })}
    </Stack>
  );
};
