-- cardテーブルを作成する
CREATE TABLE IF NOT EXISTS card (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
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
INSERT INTO card (content) VALUES ('データをSQLiteに保存する');
INSERT INTO card (content) VALUES ('データをSQLiteに保存するread');
INSERT INTO card (content) VALUES ('データをSQLiteに保存するunread0');
INSERT INTO card (content) VALUES ('データをSQLiteに保存するunread1');
INSERT INTO card (content) VALUES ('longlonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglonglong');

-- userテーブルにサンプルデータを挿入する
INSERT INTO user (id, name) VALUES (0, 'guest');
INSERT INTO user (id, name) VALUES (1, 'tester');
INSERT INTO user (id, name) VALUES (2, 'checker');

-- unread_cardテーブルにサンプルデータを挿入する
INSERT INTO unread_card (card_id, user_id) VALUES (1, 0);
INSERT INTO unread_card (card_id, user_id) VALUES (1, 1);
INSERT INTO unread_card (card_id, user_id) VALUES (1, 2);
INSERT INTO unread_card (card_id, user_id) VALUES (2, 0);
INSERT INTO unread_card (card_id, user_id) VALUES (2, 1);
INSERT INTO unread_card (card_id, user_id) VALUES (3, 0);

-- star_cardテーブルにサンプルデータを挿入する
INSERT INTO star_card (card_id, user_id) VALUES (1, 0);
INSERT INTO star_card (card_id, user_id) VALUES (1, 1);
INSERT INTO star_card (card_id, user_id) VALUES (2, 0);
INSERT INTO star_card (card_id, user_id) VALUES (2, 1);
INSERT INTO star_card (card_id, user_id) VALUES (3, 0);
