CREATE TABLE IF NOT EXISTS `turbos` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sku` VARCHAR(255) NOT NULL UNIQUE,
  `make` VARCHAR(255) NOT NULL,
  `model` VARCHAR(255) NOT NULL,
  `year` INT,
  `engine` VARCHAR(255) NOT NULL,
  `bhp` INT,
  `type` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `trade_price` DECIMAL(10, 2),
  `stock` INT NOT NULL DEFAULT 0,
  `images` JSON,
  `description` TEXT,
  `seo_slug` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  INDEX (`make`, `model`, `engine`)
);

CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `registration` VARCHAR(255) NOT NULL UNIQUE,
  `make` VARCHAR(255),
  `model` VARCHAR(255),
  `year` INT,
  `engine` VARCHAR(255),
  `fuel` VARCHAR(255),
  `colour` VARCHAR(255),
  `source` ENUM('api', 'db', 'cache') NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS `lookup_log` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `registration` VARCHAR(255) NOT NULL,
  `source` ENUM('api', 'db', 'cache') NOT NULL,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `user_ip` VARCHAR(255),
  `vehicleId` INT,
  FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL,
  INDEX (`registration`)
);

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'b2b', 'admin') NOT NULL DEFAULT 'customer',
  `first_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `company` VARCHAR(255),
  `phone` VARCHAR(255),
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `role` ENUM('customer', 'b2b', 'admin') NOT NULL,
  `user_agent` VARCHAR(255),
  `ip_address` VARCHAR(255),
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expires_at` DATETIME(3) NOT NULL,
  `revoked_at` DATETIME(3),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  INDEX (`user_id`, `revoked_at`)
);

CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `email` VARCHAR(255),
  `status` VARCHAR(255) NOT NULL DEFAULT 'pending',
  `total` DECIMAL(10, 2) NOT NULL,
  `stripe_payment_id` VARCHAR(255),
  `stripe_session_id` VARCHAR(255),
  `invoice_number` VARCHAR(255),
  `invoice_path` VARCHAR(255),
  `shipping_address` TEXT,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` INT NOT NULL,
  `turbo_id` INT NOT NULL,
  `sku` VARCHAR(255),
  `name` VARCHAR(255),
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`turbo_id`) REFERENCES `turbos`(`id`) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS `ip_blocks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `ip_address` VARCHAR(255) NOT NULL UNIQUE,
  `reason` VARCHAR(255) NOT NULL,
  `redirect_url` VARCHAR(255),
  `blocked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);
