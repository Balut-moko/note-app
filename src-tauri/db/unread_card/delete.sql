DELETE
FROM
    unread_card
WHERE
    card_id = ?
    AND user_id = ?;
