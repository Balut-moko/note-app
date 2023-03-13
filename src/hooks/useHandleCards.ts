import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api";
import * as user from "../types/user";

interface HandleFunctions {
  handleUserId: (num: number) => void;
  handleReadFilter: (value: string) => void;
  handleStarFilter: (value: string) => void;
  handleSearchBoxText: (value: string) => void;
  handleAllUnreadFlags: () => void;
  handleUnreadFlag: (id: number, unread: boolean) => void;
  handleStarFlag: (id: number, starred: boolean) => void;
  handleUpdateCards: (updateCard: user.TCard) => void;
}

export const useHandleCards = (): [
  number,
  string,
  user.TCard[],
  HandleFunctions
] => {
  const [userId, setUserId] = useState<number>(0);
  const [readFilter, setReadFilter] = useState<user.ReadFilter>("all");
  const [starFilter, setStarFilter] = useState<user.StarFilter>("all");
  const [searchBoxText, setSearchBoxText] = useState("");
  const [cards, setCards] = useState<user.TCard[]>([]);
  const [filteredCards, setFilteredCards] = useState<user.TCard[]>([]);

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

  useEffect(() => {
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

    setFilteredCards(filteredCards);
  }, [cards, readFilter, starFilter, searchBoxText]);
  const handleUserId = (num: number) => setUserId(num);

  const handleReadFilter = (value: string) => {
    setReadFilter(value as user.ReadFilter);
  };

  const handleStarFilter = (value: string) => {
    setStarFilter(value as user.StarFilter);
  };

  const handleSearchBoxText = (value: string) => setSearchBoxText(value);

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

  const handleUpdateCards = (updateCard: user.TCard) => {
    const newCards = cards.filter((card) => card.id !== updateCard.id);
    setCards([updateCard, ...newCards]);
  };

  return [
    userId,
    searchBoxText,
    filteredCards,
    {
      handleUserId,
      handleReadFilter,
      handleStarFilter,
      handleSearchBoxText,
      handleAllUnreadFlags,
      handleUnreadFlag,
      handleStarFlag,
      handleUpdateCards,
    },
  ];
};
