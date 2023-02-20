DELETE
FROM
    unread_card
WHERE
    card_id = ?;

INSERT
INTO unread_card(card_id, user_id)
SELECT
    ?
    , id
FROM
    user
WHERE
    (id != 0) AND (id != ?);
