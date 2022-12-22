use std::{collections::BTreeMap, str::FromStr};

use futures::TryStreamExt;
use sqlx::{
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions, SqliteSynchronous},
    Row, SqlitePool,
};
use crate::{Card};

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

/// マイグレーションを行う
pub(crate) async fn migrate_database(pool: &SqlitePool) -> DbResult<()> {
    sqlx::migrate!("./db").run(pool).await?;
    Ok(())
}

pub(crate) async fn get_cards(pool: &SqlitePool, user_id : i64) -> DbResult<Vec<Card>> {
  let sql1:String = format!("SELECT
                              card.id
                              , card.content
                              , card.updated
                              , card.created
                              , ifnull(unread_user.unread_flag, 0) AS unread
                              , ifnull(star_user.stared_flag, 0) AS stared
                            FROM
                              card
                              LEFT JOIN (
                                  SELECT
                                      unread_card.card_id
                                      , 1 AS unread_flag
                                  FROM
                                      unread_card
                                  WHERE
                                      unread_card.user_id = {user_id}
                              ) unread_user
                                  ON card.id = unread_user.card_id
                              LEFT JOIN (
                                  SELECT
                                      star_card.card_id
                                      , 1 AS stared_flag
                                  FROM
                                      star_card
                                  WHERE
                                      star_card.user_id = {user_id}
                              ) star_user
                                  ON card.id = star_user.card_id
                            ORDER BY
                              card.updated DESC;
                            ");

  let mut rows = sqlx::query(&sql1).fetch(pool);

  let mut cards = BTreeMap::new();
  while let Some(row) = rows.try_next().await? {
      let id: i64 = row.try_get("id")?;
      let content: &str = row.try_get("content")?;
      let updated: &str = row.try_get("updated")?;
      let created: &str = row.try_get("created")?;
      let unread: i64 = row.try_get("unread")?;
      let stared: i64 = row.try_get("stared")?;
      cards.insert(id, Card::new(
        id, content, updated, created, unread, stared
      ));
  }

  Ok(cards.into_iter().map(|(_k, v)| v).collect())
}
pub(crate) async fn get_username(pool: &SqlitePool, user_id : i64) -> DbResult<String> {
  let sql1:String = format!("SELECT
                            name
                          FROM
                            user
                          WHERE
                            id = {user_id}
                      ");

  let row = sqlx::query(&sql1).fetch_one(pool).await?;
  let name: &str = row.try_get("name")?;

  Ok(name.to_string())
}

pub(crate) async fn insert_star_flag(pool: &SqlitePool, card_id: i64, user_id: i64) -> DbResult<()> {
  let mut tx = pool.begin().await?;

  sqlx::query("INSERT INTO star_card (card_id, user_id) VALUES (?, ?)")
      .bind(card_id)
      .bind(user_id)
      .execute(&mut tx)
      .await?;

  tx.commit().await?;

  Ok(())
}

pub(crate) async fn delete_star_flag(pool: &SqlitePool, card_id: i64, user_id: i64) -> DbResult<()> {
  let mut tx = pool.begin().await?;

  sqlx::query("DELETE FROM star_card WHERE card_id = ? AND user_id = ?")
      .bind(card_id)
      .bind(user_id)
      .execute(&mut tx)
      .await?;

  tx.commit().await?;

  Ok(())
}

pub(crate) async fn insert_unread_flag(pool: &SqlitePool, card_id: i64, user_id: i64) -> DbResult<()> {
  let mut tx = pool.begin().await?;

  sqlx::query("INSERT INTO unread_card (card_id, user_id) VALUES (?, ?)")
      .bind(card_id)
      .bind(user_id)
      .execute(&mut tx)
      .await?;

  tx.commit().await?;

  Ok(())
}

pub(crate) async fn delete_unread_flag(pool: &SqlitePool, card_id: i64, user_id: i64) -> DbResult<()> {
  let mut tx = pool.begin().await?;

  sqlx::query("DELETE FROM unread_card WHERE card_id = ? AND user_id = ?")
      .bind(card_id)
      .bind(user_id)
      .execute(&mut tx)
      .await?;

  tx.commit().await?;

  Ok(())
}
