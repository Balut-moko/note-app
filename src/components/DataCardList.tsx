import { Virtuoso } from "react-virtuoso";

import { DataCard } from "./DataCard";

import * as user from "../types/user";

type Props = {
  userId: number;
  searchBoxText: string;
  DataCards: user.TCard[];
  handleUnreadFlag: (id: number, unread: boolean) => void;
  handleStarFlag: (id: number, starred: boolean) => void;
  handleUpdateCards: (updateCard: user.TCard) => void;
};

export const DataCardList: React.FC<Props> = ({
  userId,
  searchBoxText,
  DataCards,
  handleUnreadFlag,
  handleStarFlag,
  handleUpdateCards,
}) => {
  return (
    <>
      <Virtuoso
        style={{
          height: "100%",
        }}
        totalCount={DataCards.length}
        itemContent={(index: number) => (
          <DataCard
            userId={userId}
            data={DataCards[index]}
            highlightText={searchBoxText}
            handleStarFlag={handleStarFlag}
            handleUnreadFlag={handleUnreadFlag}
            handleUpdateCards={handleUpdateCards}
          />
        )}
      />
    </>
  );
};
