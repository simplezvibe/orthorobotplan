const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'orthorobot.db');
const db = new Database(dbPath);

function initializeDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS robots (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      manufacturer TEXT NOT NULL,
      origin TEXT NOT NULL,
      nmpa TEXT,
      technology TEXT,
      accuracy TEXT,
      installations TEXT,
      evidence TEXT,
      color TEXT,
      image TEXT,
      recovery_time TEXT,
      pain_level TEXT,
      estimated_cost TEXT,
      hospital_count INTEGER,
      patient_rating REAL,
      success_rate TEXT,
      avg_operation_time TEXT,
      learning_curve TEXT,
      publications INTEGER,
      clinical_trials INTEGER,
      fda_clearance TEXT,
      ce_certification TEXT,
      arm_dof INTEGER,
      arm_brand TEXT,
      camera_brand TEXT,
      navigation_system TEXT,
      haptic_feedback BOOLEAN,
      real_time_tracking BOOLEAN,
      software_version TEXT,
      service_network TEXT,
      training_program TEXT,
      annual_maintenance TEXT
    )
  `);

  db.exec(`CREATE TABLE IF NOT EXISTS indications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      robot_id INTEGER,
      indication TEXT,
      FOREIGN KEY (robot_id) REFERENCES robots(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS advantages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      robot_id INTEGER,
      advantage TEXT,
      FOREIGN KEY (robot_id) REFERENCES robots(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS limitations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      robot_id INTEGER,
      limitation TEXT,
      FOREIGN KEY (robot_id) REFERENCES robots(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS patient_benefits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      robot_id INTEGER,
      benefit TEXT,
      FOREIGN KEY (robot_id) REFERENCES robots(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      robot_id INTEGER,
      hospital_name TEXT,
      FOREIGN KEY (robot_id) REFERENCES robots(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS implant_compatibility (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      robot_id INTEGER,
      implant TEXT,
      FOREIGN KEY (robot_id) REFERENCES robots(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      date TEXT,
      source TEXT,
      tag TEXT,
      tag_color TEXT,
      summary TEXT,
      is_hot BOOLEAN DEFAULT 0
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS patient_stories (
      id INTEGER PRIMARY KEY,
      name TEXT,
      age INTEGER,
      surgery TEXT,
      robot TEXT,
      hospital TEXT,
      recovery TEXT,
      rating INTEGER,
      comment TEXT,
      date TEXT
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS surgical_tips (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      tip TEXT NOT NULL
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS cities (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tier INTEGER NOT NULL
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS anatomy_education (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      duration TEXT,
      recovery TEXT,
      lifespan TEXT
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS anatomy_suitable (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anatomy_id TEXT,
      type TEXT,
      item TEXT,
      FOREIGN KEY (anatomy_id) REFERENCES anatomy_education(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS anatomy_advantages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anatomy_id TEXT,
      advantage TEXT,
      FOREIGN KEY (anatomy_id) REFERENCES anatomy_education(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS anatomy_steps (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anatomy_id TEXT,
      title TEXT,
      description TEXT,
      icon TEXT,
      step_order INTEGER,
      FOREIGN KEY (anatomy_id) REFERENCES anatomy_education(id)
    )`);

  db.exec(`CREATE TABLE IF NOT EXISTS pricing_policies (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      unit TEXT,
      category TEXT,
      note TEXT
    )`);

  console.log('Database tables created successfully');
}

module.exports = { db, initializeDatabase };
