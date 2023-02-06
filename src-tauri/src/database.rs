use std::{collections::BTreeMap, str::FromStr};

use futures::TryStreamExt;
use sqlx::{
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous},
    Row, SqlitePool,
};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct User {
  id: i64,
  name: String,
}

impl User {
  pub fn new(id: i64, name: &str) -> Self {
      User {
          id,
          name: name.to_string(),
      }
  }
}


#[derive(Debug, Serialize, Deserialize)]
pub struct Card {
  id: i64,
  content: String,
  pic_id: i64,
  updated: String,
  created: String,
  unread: bool,
  starred: bool,
}

impl Card {
  pub fn new(id: i64, content: &str, pic_id:i64,updated: &str, created: &str,unread:i64, starred:i64) -> Self {
      Card {
          id,
          content: content.to_string(),
          pic_id,
          updated: updated.to_string(),
          created: created.to_string(),
          unread: if unread == 1 {true} else {false},
          starred: if starred == 1 {true} else {false},
      }
  }
}



type DbResult<T> = Result<T, Box<dyn std::error::Error>>;

pub(crate) async fn create_sqlite_pool(database_url: &str) -> DbResult<SqlitePool> {
    let connection_options = SqliteConnectOptions::from_str(database_url)?
        .create_if_missing(true)
        .journal_mode(SqliteJournalMode::Wal)
        .synchronous(SqliteSynchronous::Normal);

    let sqlite_pool = SqlitePoolOptions::new()
        .connect_with(connection_options)
        .await?;

    Ok(sqlite_pool)
}

pub(crate) async fn migrate_database(pool: &SqlitePool) -> DbResult<()> {
    sqlx::migrate!("./db/migrations").run(pool).await?;
    Ok(())
}

pub(crate) async fn get_cards(pool: &SqlitePool, user_id : i64) -> DbResult<Vec<Card>> {
  let sql = std::fs::read_to_string("./db/user/get_cards.sql")?;

  let mut rows = sqlx::query(&sql)
    .bind(user_id)
    .bind(user_id)
    .fetch(pool);

  let mut cards = BTreeMap::new();
  while let Some(row) = rows.try_next().await? {
    let id: i64 = row.try_get("id")?;
    let content: &str = row.try_get("content")?;
    let pic_id: i64 = row.try_get("pic_id")?;
    let updated: &str = row.try_get("updated")?;
    let created: &str = row.try_get("created")?;
    let unread: i64 = row.try_get("unread")?;
    let starred: i64 = row.try_get("starred")?;
    cards.insert(id, Card::new(
      id, content, pic_id, updated, created, unread, starred
    ));
  }

  Ok(cards.into_iter().map(|(_k, v)| v).collect())
}

pub(crate) async fn get_username(pool: &SqlitePool, user_id : i64) -> DbResult<String> {
  let sql = std::fs::read_to_string("./db/user/get_name.sql")?;

  let row = sqlx::query(&sql)
    .bind(user_id)
    .fetch_one(pool).await?;

  let name: &str = row.try_get("name")?;

  Ok(name.to_string())
}
pub(crate) async fn get_users(pool: &SqlitePool) -> DbResult<Vec<User>> {
  let sql = std::fs::read_to_string("./db/user/get_all_user.sql")?;

  let mut rows = sqlx::query(&sql)
    .fetch(pool);

  let mut users = BTreeMap::new();
  while let Some(row) = rows.try_next().await? {
    let id: i64 = row.try_get("id")?;
    let name: &str = row.try_get("name")?;
    users.insert(id, User::new(id, name));
  }

  Ok(users.into_iter().map(|(_k, v)| v).collect())
}


pub(crate) async fn manage_flags(
  pool: &SqlitePool,
  table:&str,
  method:&str,
  card_id: i64,
  user_id: i64
)-> DbResult<()> {
  let mut tx = pool.begin().await?;
  let sql = std::fs::read_to_string(format!("./db/{table}/{method}.sql"))?;

  sqlx::query(&sql)
    .bind(card_id)
    .bind(user_id)
    .execute(&mut tx)
    .await?;

  tx.commit().await?;

  Ok(())
}

pub(crate) async fn delete_all_unread_flags(
  pool: &SqlitePool,
  user_id: i64
)-> DbResult<()> {
  let mut tx = pool.begin().await?;
  let sql = std::fs::read_to_string(format!("./db/unread_card/delete_all.sql"))?;

  sqlx::query(&sql)
    .bind(user_id)
    .execute(&mut tx)
    .await?;

  tx.commit().await?;

  Ok(())
}
