SELECT
    card_id
    , user_id
FROM
    star_card
WHERE
    card_id = ?
    AND user_id = ?;
