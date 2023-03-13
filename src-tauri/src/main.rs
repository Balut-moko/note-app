#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::process::Command;

use tauri::{Manager, State};
use crate::database::{Card, User};

pub(crate) mod database;

#[tauri::command]
async fn get_cards(sqlite_pool: State<'_, sqlx::SqlitePool>, user_id:i64) -> Result<Vec<Card>, String> {
  let cards = database::get_cards(&*sqlite_pool, user_id)
      .await
      .map_err(|e| e.to_string())?;
  Ok( cards )
}

#[tauri::command]
async fn get_user_name(sqlite_pool: State<'_, sqlx::SqlitePool>, user_id:i64) -> Result<String, String> {
  let user_name = database::get_username(&*sqlite_pool, user_id)
      .await
      .map_err(|e| e.to_string())?;
  Ok(user_name)
}

#[tauri::command]
async fn get_users(sqlite_pool: State<'_, sqlx::SqlitePool>) -> Result<Vec<User>, String> {
  let users = database::get_users(&*sqlite_pool)
      .await
      .map_err(|e| e.to_string())?;
  Ok(users)
}

#[tauri::command]
async fn handle_flags(
  sqlite_pool: State<'_, sqlx::SqlitePool>,
  table:&str,
  method:&str,
  card_id: i64,
  user_id: i64,
) -> Result<(), String> {
  database::manage_flags(&*sqlite_pool, table, method, card_id, user_id)
  .await
  .map_err(|e| e.to_string() )?;

  Ok(())
}

#[tauri::command]
async fn handle_delete_all_unread_flags(
  sqlite_pool: State<'_, sqlx::SqlitePool>,
  user_id: i64,
) -> Result<(), String> {
  database::delete_all_unread_flags(&*sqlite_pool,  user_id)
  .await
  .map_err(|e| e.to_string() )?;

  Ok(())
}

#[tauri::command]
async fn handle_insert_card(
  sqlite_pool: State<'_, sqlx::SqlitePool>,
  user_id: i64,
  content: &str,
  pic_id: i64
) -> Result<Card, String> {
  let card = database::insert_card(&*sqlite_pool, user_id, content, pic_id)
  .await
  .map_err(|e| e.to_string() )?;

  Ok(card)
}

#[tauri::command]
async fn handle_update_card(
  sqlite_pool: State<'_, sqlx::SqlitePool>,
  user_id: i64,
  card_id: i64,
  content: &str,
  pic_id: i64,
  updated: &str,
) -> Result<Card, String> {
  let card = database::update_card(&*sqlite_pool, user_id, card_id, content, pic_id, updated)
  .await
  .map_err(|e| e.to_string() )?;

  Ok(card)
}

#[tauri::command]
fn show_in_folder(mut path: String, card_id:i64) {
  let path2 = std::path::PathBuf::from(&path).join("note-db/attachedFiles").join(card_id.to_string());
  path = path2.to_str().unwrap().to_string();
  std::fs::create_dir_all(path2).expect("create_dir failed");

  #[cfg(target_os = "windows")]
  {
    Command::new("explorer")
        .args(["/n,", &path]) // The comma after select is not a typo
        .spawn()
        .unwrap();
  }

  #[cfg(target_os = "linux")]
  {
    if path.contains(",") {
      // see https://gitlab.freedesktop.org/dbus/dbus/-/issues/76
      let new_path = match metadata(&path).unwrap().is_dir() {
        true => path,
        false => {
          let mut path2 = std::path::PathBuf::from(path);
          path2.pop();
          path2.into_os_string().into_string().unwrap()
        }
      };
      Command::new("xdg-open")
          .arg(&new_path)
          .spawn()
          .unwrap();
    } else {
      Command::new("dbus-send")
          .args(["--session", "--dest=org.freedesktop.FileManager1", "--type=method_call",
                "/org/freedesktop/FileManager1", "org.freedesktop.FileManager1.ShowItems",
                format!("array:string:\"file://{path}\"").as_str(), "string:\"\""])
          .spawn()
          .unwrap();
    }
  }

  #[cfg(target_os = "macos")]
  {
    Command::new("open")
        .args(["-R", &path])
        .spawn()
        .unwrap();
  }
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
  tauri::Builder::default()
  .invoke_handler(tauri::generate_handler![
    get_cards,
    get_user_name,
    get_users,
    handle_flags,
    handle_delete_all_unread_flags,
    handle_insert_card,
    handle_update_card,
    show_in_folder
  ])
  // ハンドラからコネクションプールにアクセスできるよう、登録する
  .setup(|app| {
    use tauri::async_runtime::block_on;

    const DATABASE_DIR: &str = "db";
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
    .replace('\\', "/")
    .replace("//?/UNC/", "//");
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