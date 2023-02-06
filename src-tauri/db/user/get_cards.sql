SELECT
    card.id
    , card.content
    , card.pic_id
    , card.updated
    , card.created
    , ifnull(unread_user.unread_flag, 0) AS unread
    , ifnull(star_user.starred_flag, 0) AS starred
FROM
    card
    LEFT JOIN (
        SELECT
            unread_card.card_id
            , 1 AS unread_flag
        FROM
            unread_card
        WHERE
            unread_card.user_id = ?
    ) unread_user
        ON card.id = unread_user.card_id
    LEFT JOIN (
        SELECT
            star_card.card_id
            , 1 AS starred_flag
        FROM
            star_card
        WHERE
            star_card.user_id = ?
    ) star_user
        ON card.id = star_user.card_id
ORDER BY
    card.updated DESC;
