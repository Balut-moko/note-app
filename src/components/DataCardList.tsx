import { invoke } from "@tauri-apps/api";
import { useEffect, useState } from "react";

import { Button, Stack } from "@chakra-ui/react";

import { AddIcon, CheckIcon } from "@chakra-ui/icons";
import { Virtuoso } from "react-virtuoso";

import * as user from "../types/user";
import { DataCard } from "./DataCard";

type Props = {
  userId: number;
  readFilter: user.ReadFilter;
  starFilter: user.StarFilter;
  searchBoxText: string;
};

export const DataCardList: React.FC<Props> = ({
  userId,
  readFilter,
  starFilter,
  searchBoxText,
}) => {
  const [cards, setCards] = useState<user.TCard[]>([]);

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
      <Stack height="50px" direction="row" pl="2">
        <Button
          rightIcon={<AddIcon />}
          colorScheme="teal"
          variant="outline"
          // onClick={() => handleOpenModal(null)}
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
      <Virtuoso
        style={{ height: "calc(100% - 50px)" }}
        totalCount={filteredCards.length}
        itemContent={(index: number) => (
          <DataCard
            userId={userId}
            data={filteredCards[index]}
            handleStarFlag={handleStarFlag}
            handleUnreadFlag={handleUnreadFlag}
          />
        )}
      />
    </>
  );
};
