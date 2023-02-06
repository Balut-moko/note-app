-- cardテーブルを作成する
CREATE TABLE IF NOT EXISTS card (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    pic_id INTEGER NOT NULL,
    updated TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime')),
    created TIMESTAMP DEFAULT (datetime(CURRENT_TIMESTAMP,'localtime'))
);

-- userテーブルを作成する
CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY NOT NULL,
    name TEXT NOT NULL
);

-- unread_cardテーブルを作成する
CREATE TABLE IF NOT EXISTS unread_card (
    card_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (card_id, user_id),
    FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

-- star_cardテーブルを作成する
CREATE TABLE IF NOT EXISTS star_card (
    card_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    PRIMARY KEY (card_id, user_id),
    FOREIGN KEY (card_id) REFERENCES card (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE
);

-- cardテーブルにサンプルデータを挿入する
INSERT INTO card (content, pic_id) VALUES ('データをSQLiteに保存する', 1);
INSERT INTO card (content, pic_id) VALUES ('unread id:1,2 star 1,3', 2);
INSERT INTO card (content, pic_id) VALUES ('unread id:2,3 star 1,2', 3);
INSERT INTO card (content, pic_id) VALUES ('unread id:1,3 star 2,3', 1);
INSERT INTO card (content, pic_id) VALUES ('longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong', 2);
INSERT INTO card (content, pic_id) VALUES ('longlonglonglonglonglonglong
longlonglonglonglonglonglonglonglong
longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong
longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong
longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong
longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglong', 3);

-- userテーブルにサンプルデータを挿入する
INSERT INTO user (id, name) VALUES (0, 'guest');
INSERT INTO user (id, name) VALUES (1, 'user1');
INSERT INTO user (id, name) VALUES (2, 'user2');
INSERT INTO user (id, name) VALUES (3, 'user3');

-- unread_cardテーブルにサンプルデータを挿入する
INSERT INTO unread_card (card_id, user_id) VALUES (2, 1);
INSERT INTO unread_card (card_id, user_id) VALUES (2, 2);
INSERT INTO unread_card (card_id, user_id) VALUES (3, 2);
INSERT INTO unread_card (card_id, user_id) VALUES (3, 3);
INSERT INTO unread_card (card_id, user_id) VALUES (4, 1);
INSERT INTO unread_card (card_id, user_id) VALUES (4, 3);

-- star_cardテーブルにサンプルデータを挿入する
INSERT INTO star_card (card_id, user_id) VALUES (2, 1);
INSERT INTO star_card (card_id, user_id) VALUES (2, 3);
INSERT INTO star_card (card_id, user_id) VALUES (3, 1);
INSERT INTO star_card (card_id, user_id) VALUES (3, 2);
INSERT INTO star_card (card_id, user_id) VALUES (4, 2);
INSERT INTO star_card (card_id, user_id) VALUES (4, 3);
