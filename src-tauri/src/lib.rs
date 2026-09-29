use std::fs;
use std::path::PathBuf;
use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct AudioSystemInfo {
    pub platform: String,
    pub sample_rate: u32,
    pub bit_depth: u16,
    pub channels: u16,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct MidiDevice {
    pub id: usize,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct ExportResult {
    pub success: bool,
    pub path: String,
    pub file_size_bytes: usize,
}

/// Query connected MIDI input hardware devices via midir
#[tauri::command]
fn list_midi_inputs() -> Result<Vec<MidiDevice>, String> {
    match midir::MidiInput::new("fractunes") {
        Ok(midi_in) => {
            let mut devices = Vec::new();
            for (i, port) in midi_in.ports().iter().enumerate() {
                let name = midi_in.port_name(port).unwrap_or_else(|_| format!("MIDI Device {}", i));
                devices.push(MidiDevice { id: i, name });
            }
            Ok(devices)
        }
        Err(e) => Err(format!("Failed to initialize MIDI: {}", e)),
    }
}

/// Returns native host audio architecture info
#[tauri::command]
fn get_audio_system_info() -> AudioSystemInfo {
    AudioSystemInfo {
        platform: std::env::consts::OS.to_string(),
        sample_rate: 44100,
        bit_depth: 16,
        channels: 2,
    }
}

/// Fast native WAV export using the `hound` crate.
/// Writes directly to the user's Music or Downloads folder.
#[tauri::command]
fn export_wav_file(filename: String, samples: Vec<f32>, sample_rate: u32, channels: u16) -> Result<ExportResult, String> {
    let base_dir = dirs::audio_dir()
        .or_else(dirs::download_dir)
        .or_else(dirs::home_dir)
        .unwrap_or_else(|| PathBuf::from("."));

    let target_dir = base_dir.join("PsyFracta_Exports");
    if !target_dir.exists() {
        let _ = fs::create_dir_all(&target_dir);
    }

    let file_path = target_dir.join(&filename);
    let spec = hound::WavSpec {
        channels,
        sample_rate,
        bits_per_sample: 16,
        sample_format: hound::SampleFormat::Int,
    };

    let mut writer = hound::WavWriter::create(&file_path, spec)
        .map_err(|e| format!("Failed to create WAV file: {}", e))?;

    for &s in &samples {
        let clamped = s.max(-1.0).min(1.0);
        let val = if clamped < 0.0 {
            (clamped * 32768.0) as i16
        } else {
            (clamped * 32767.0) as i16
        };
        writer.write_sample(val).map_err(|e| format!("Write sample error: {}", e))?;
    }

    writer.finalize().map_err(|e| format!("Finalize WAV error: {}", e))?;

    let file_size = fs::metadata(&file_path).map(|m| m.len() as usize).unwrap_or(0);

    Ok(ExportResult {
        success: true,
        path: file_path.to_string_lossy().to_string(),
        file_size_bytes: file_size,
    })
}

/// Save custom soundbank preset JSON to disk
#[tauri::command]
fn save_user_preset(name: String, preset_json: String) -> Result<String, String> {
    let base_dir = dirs::config_dir()
        .or_else(dirs::home_dir)
        .unwrap_or_else(|| PathBuf::from("."));

    let presets_dir = base_dir.join("fractunes").join("presets");
    fs::create_dir_all(&presets_dir).map_err(|e| format!("Failed to create presets dir: {}", e))?;

    let safe_name = name.replace(|c: char| !c.is_alphanumeric() && c != '_' && c != '-', "_");
    let path = presets_dir.join(format!("{}.json", safe_name));

    fs::write(&path, preset_json).map_err(|e| format!("Failed to write preset: {}", e))?;
    Ok(path.to_string_lossy().to_string())
}

/// Open an external URL in the user's default system browser
#[tauri::command]
fn open_external_url(url: String) -> Result<(), String> {
    #[cfg(target_os = "macos")]
    std::process::Command::new("open")
        .arg(&url)
        .spawn()
        .map_err(|e| format!("Failed to open URL: {}", e))?;

    #[cfg(target_os = "windows")]
    std::process::Command::new("cmd")
        .args(["/C", "start", "", &url])
        .spawn()
        .map_err(|e| format!("Failed to open URL: {}", e))?;

    #[cfg(target_os = "linux")]
    std::process::Command::new("xdg-open")
        .arg(&url)
        .spawn()
        .map_err(|e| format!("Failed to open URL: {}", e))?;

    Ok(())
}

#[cfg(target_os = "macos")]
fn set_macos_dock_icon() {
    use objc2::{AllocAnyThread, MainThreadMarker};
    use objc2_app_kit::{NSApplication, NSImage};
    use objc2_foundation::NSData;

    let icon_bytes = include_bytes!("../icons/icon.png");
    let mtm = unsafe { MainThreadMarker::new_unchecked() };
    let app = NSApplication::sharedApplication(mtm);
    let data = NSData::with_bytes(icon_bytes);
    if let Some(app_icon) = NSImage::initWithData(NSImage::alloc(), &data) {
        unsafe { app.setApplicationIconImage(Some(&app_icon)) };
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            #[cfg(target_os = "macos")]
            set_macos_dock_icon();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            list_midi_inputs,
            get_audio_system_info,
            export_wav_file,
            save_user_preset,
            open_external_url,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
