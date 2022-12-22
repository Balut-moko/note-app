import { useState, useEffect } from "react";
import * as user from "../types/user";
import { invoke } from "@tauri-apps/api";

const useGetUserNote = (userId: number) => {
  const [note, setNote] = useState<user.TNote>({ userId: 0, cards: [] });

  useEffect(() => {
    (async () => {
      const invokeNote: user.TInvokeNote = await invoke<user.TInvokeNote>(
        "get_note",
        {
          userId: userId,
        }
      ).catch((err) => {
        console.error(err);
        return { user_id: 0, cards: [] };
      });
      const note: user.TNote = {
        userId: invokeNote.user_id,
        cards: invokeNote.cards,
      };
      setNote(note);
    })();
  }, [userId]);

  return [note];
};

export const useGetUserFilteredNote = (
  userId: number,
  starFilterFlags: boolean[],
  readFilterFlags: boolean[],
  searchBoxText: string
) => {
  const [userNote] = useGetUserNote(userId);
  const userFilteredNote = { ...userNote };
  if (!starFilterFlags.every(Boolean) && starFilterFlags.some(Boolean)) {
    const starFlag = starFilterFlags[0] ? 1 : 0;
    userFilteredNote.cards = userFilteredNote.cards.filter((card) => {
      return card.stared == starFlag;
    });
  } else if (!starFilterFlags.every(Boolean)) {
    userFilteredNote.cards = [];
  }

  if (!readFilterFlags.every(Boolean) && readFilterFlags.some(Boolean)) {
    const unreadFlag = readFilterFlags[0] ? 1 : 0;
    userFilteredNote.cards = userFilteredNote.cards.filter((card) => {
      return card.unread == unreadFlag;
    });
  } else if (!readFilterFlags.every(Boolean)) {
    userFilteredNote.cards = [];
  }

  if (searchBoxText != "") {
    userFilteredNote.cards = userFilteredNote.cards.filter((card) => {
      return card.content.match(searchBoxText);
    });
  }
  return [userFilteredNote];
};
