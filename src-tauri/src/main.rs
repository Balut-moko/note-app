#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use serde::{Deserialize, Serialize};
use tauri::{Manager, State};

pub(crate) mod database;

#[derive(Debug, Serialize, Deserialize)]
pub struct Note {
  user_id: i64,
  cards: Vec<Card>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Card {
  id: i64,
  content: String,
  updated: String,
  created: String,
  unread: i64,
  stared: i64,
}

impl Card {
  pub fn new(id: i64, content: &str, updated: &str, created: &str,unread:i64, stared:i64) -> Self {
      Card {
          id,
          content: content.to_string(),
          updated: updated.to_string(),
          created: created.to_string(),
          unread: unread,
          stared: stared,
      }
  }
}

#[tauri::command]
async fn get_note(sqlite_pool: State<'_, sqlx::SqlitePool>, user_id:i64) -> Result<Note, String> {
  let cards = database::get_cards(&*sqlite_pool, user_id)
      .await
      .map_err(|e| e.to_string())?;
  Ok(Note { user_id, cards })
}

#[tauri::command]
async fn get_user_name(sqlite_pool: State<'_, sqlx::SqlitePool>, user_id:i64) -> Result<String, String> {
  let user_name = database::get_username(&*sqlite_pool, user_id)
      .await
      .map_err(|e| e.to_string())?;
  Ok(user_name)
}

#[tauri::command]
async fn handle_star_flag(
  sqlite_pool: State<'_, sqlx::SqlitePool>,
  card_id: i64,
  user_id: i64,
  star_flag:bool
) -> Result<(), String> {if star_flag {
  database::delete_star_flag(&*sqlite_pool, card_id, user_id)
  .await
  .map_err(|e| e.to_string())?;
} else {
  database::insert_star_flag(&*sqlite_pool, card_id, user_id)
  .await
  .map_err(|e| e.to_string())?;
  }
  Ok(())
}
#[tauri::command]
async fn handle_unread_flag(
  sqlite_pool: State<'_, sqlx::SqlitePool>,
  card_id: i64,
  user_id: i64,
  unread_flag:bool
) -> Result<(), String> {if unread_flag {
  database::delete_unread_flag(&*sqlite_pool, card_id, user_id)
  .await
  .map_err(|e| e.to_string() )?;
} else {
  database::insert_unread_flag(&*sqlite_pool, card_id, user_id)
  .await
  .map_err(|e| e.to_string())?;
  }
  Ok(())
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![
    get_note,
    get_user_name,
    handle_star_flag,
    handle_unread_flag
  ])
  // ハンドラからコネクションプールにアクセスできるよう、登録する
  .setup(|app| {
    use tauri::async_runtime::block_on;

    const DATABASE_DIR: &str = "note-db";
    const DATABASE_FILE: &str = "db.sqlite";
    let app_resource_dir = tauri::App::path_resolver(&app).resource_dir().unwrap();
    let database_dir = app_resource_dir.join(DATABASE_DIR);
    let database_file = database_dir.join(DATABASE_FILE);

    let db_exists = std::fs::metadata(&database_file).is_ok();
    if !db_exists {
        std::fs::create_dir_all(&database_dir)?;
    }
    let database_dir_str = dunce::canonicalize(&database_dir)
    .unwrap()
    .to_string_lossy()
    .replace('\\', "/");
    let database_url = format!("sqlite://{}/{}", database_dir_str, DATABASE_FILE);
    let sqlite_pool = block_on(database::create_sqlite_pool(&database_url))?;

    if !db_exists {
        block_on(database::migrate_database(&sqlite_pool))?;
    }

    app.manage(sqlite_pool);
    Ok(())
  })
  .run(tauri::generate_context!())
  .expect("error while running tauri application");

  Ok(())
}