-- ============================================================
-- Xtreme Fitness - MySQL Schema Reference
-- Note: In development, Sequelize's sequelize.sync({ alter: true })
-- creates/updates these tables automatically from the models.
-- This file is provided for production DBAs who prefer explicit DDL
-- or want to review the schema before running migrations.
-- ============================================================

CREATE DATABASE IF NOT EXISTS xtreme_fitness CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE xtreme_fitness;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  phone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('admin','trainer','member') NOT NULL DEFAULT 'member',
  profile_image VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_email_verified BOOLEAN DEFAULT FALSE,
  reset_password_token VARCHAR(255),
  reset_password_expires DATETIME,
  last_login_at DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  INDEX idx_users_role (role)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  member_code VARCHAR(20) NOT NULL UNIQUE,
  date_of_birth DATE,
  gender ENUM('male','female','other'),
  address VARCHAR(255),
  emergency_contact_name VARCHAR(120),
  emergency_contact_phone VARCHAR(20),
  height_cm DECIMAL(5,2),
  weight_kg DECIMAL(5,2),
  goal VARCHAR(255),
  assigned_trainer_id INT,
  join_date DATE NOT NULL,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS trainers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL UNIQUE,
  trainer_code VARCHAR(20) NOT NULL UNIQUE,
  specialization VARCHAR(255),
  experience_years INT,
  certifications TEXT,
  bio TEXT,
  salary DECIMAL(10,2),
  shift_start TIME,
  shift_end TIME,
  rating DECIMAL(2,1) DEFAULT 0,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE members ADD CONSTRAINT fk_members_trainer
  FOREIGN KEY (assigned_trainer_id) REFERENCES trainers(id) ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_days INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  features JSON,
  is_active BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS subscriptions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  plan_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status ENUM('active','expired','cancelled','pending') DEFAULT 'pending',
  auto_renew BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id),
  INDEX idx_sub_member (member_id),
  INDEX idx_sub_status (status),
  INDEX idx_sub_end (end_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT,
  trainer_id INT,
  date DATE NOT NULL,
  check_in TIME,
  check_out TIME,
  status ENUM('present','absent','late') DEFAULT 'present',
  check_in_method ENUM('qr','manual') DEFAULT 'manual',
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE CASCADE,
  INDEX idx_att_member_date (member_id, date),
  INDEX idx_att_trainer_date (trainer_id, date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  subscription_id INT,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('cash','card','upi','net_banking') DEFAULT 'cash',
  status ENUM('paid','pending','failed','refunded') DEFAULT 'pending',
  transaction_ref VARCHAR(100),
  paid_at DATETIME,
  notes VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id),
  INDEX idx_pay_member (member_id),
  INDEX idx_pay_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  invoice_number VARCHAR(30) NOT NULL UNIQUE,
  member_id INT NOT NULL,
  payment_id INT,
  subtotal DECIMAL(10,2) NOT NULL,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status ENUM('paid','unpaid','overdue') DEFAULT 'unpaid',
  due_date DATE,
  issued_at DATETIME NOT NULL,
  pdf_path VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (payment_id) REFERENCES payments(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info','success','warning','danger') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  link VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_notif_user (user_id),
  INDEX idx_notif_read (is_read)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(150),
  category ENUM('transformation','facility','event','general') DEFAULT 'general',
  image_url VARCHAR(255) NOT NULL,
  before_image_url VARCHAR(255),
  after_image_url VARCHAR(255),
  description VARCHAR(500),
  uploaded_by INT,
  is_published BOOLEAN DEFAULT TRUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS workout_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  trainer_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  goal VARCHAR(150),
  exercises JSON NOT NULL,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS diet_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  trainer_id INT NOT NULL,
  title VARCHAR(150) NOT NULL,
  target_calories INT,
  meals JSON NOT NULL,
  notes TEXT,
  start_date DATE,
  end_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  FOREIGN KEY (trainer_id) REFERENCES trainers(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  recorded_at DATE NOT NULL,
  weight_kg DECIMAL(5,2),
  height_cm DECIMAL(5,2),
  bmi DECIMAL(5,2),
  body_fat_percent DECIMAL(5,2),
  chest_cm DECIMAL(5,2),
  waist_cm DECIMAL(5,2),
  arms_cm DECIMAL(5,2),
  notes VARCHAR(500),
  photo_url VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
  INDEX idx_progress_member_date (member_id, recorded_at)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  phone VARCHAR(20),
  subject VARCHAR(200),
  message TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(220) NOT NULL UNIQUE,
  excerpt VARCHAR(500),
  content LONGTEXT NOT NULL,
  cover_image VARCHAR(255),
  author_id INT NOT NULL,
  category VARCHAR(80),
  tags JSON,
  is_published BOOLEAN DEFAULT FALSE,
  published_at DATETIME,
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL,
  FOREIGN KEY (author_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  `key` VARCHAR(100) NOT NULL UNIQUE,
  value JSON,
  description VARCHAR(255),
  created_at DATETIME NOT NULL,
  updated_at DATETIME NOT NULL
) ENGINE=InnoDB;
