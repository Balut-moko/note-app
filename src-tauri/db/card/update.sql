UPDATE card
SET
    content = ?
    , pic_id = ?
    , updated = ?
WHERE
    id = ?
RETURNING *;
