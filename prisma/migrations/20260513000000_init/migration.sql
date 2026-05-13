CREATE TABLE IF NOT EXISTS `turbos` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `sku` VARCHAR(191) NOT NULL,
  `make` VARCHAR(191) NOT NULL,
  `model` VARCHAR(191) NOT NULL,
  `year` INTEGER NULL,
  `engine` VARCHAR(191) NOT NULL,
  `bhp` INTEGER NULL,
  `type` VARCHAR(191) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL,
  `trade_price` DECIMAL(10, 2) NULL,
  `stock` INTEGER NOT NULL DEFAULT 0,
  `images` JSON NULL,
  `description` TEXT NULL,
  `seo_slug` VARCHAR(191) NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updated_at` DATETIME(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `turbos_sku_key` (`sku`),
  UNIQUE INDEX `turbos_seo_slug_key` (`seo_slug`),
  INDEX `turbos_make_model_engine_idx` (`make`, `model`, `engine`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `vehicles` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `registration` VARCHAR(191) NOT NULL,
  `make` VARCHAR(191) NULL,
  `model` VARCHAR(191) NULL,
  `year` INTEGER NULL,
  `engine` VARCHAR(191) NULL,
  `fuel` VARCHAR(191) NULL,
  `colour` VARCHAR(191) NULL,
  `source` ENUM('api', 'db', 'cache') NOT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `vehicles_registration_key` (`registration`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `lookup_log` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `registration` VARCHAR(191) NOT NULL,
  `source` ENUM('api', 'db', 'cache') NOT NULL,
  `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `user_ip` VARCHAR(191) NULL,
  `vehicleId` INTEGER NULL,
  PRIMARY KEY (`id`),
  INDEX `lookup_log_registration_idx` (`registration`),
  INDEX `lookup_log_vehicleId_idx` (`vehicleId`),
  CONSTRAINT `lookup_log_vehicleId_fkey` FOREIGN KEY (`vehicleId`) REFERENCES `vehicles`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(191) NOT NULL,
  `password_hash` VARCHAR(191) NOT NULL,
  `role` ENUM('customer', 'b2b', 'admin') NOT NULL DEFAULT 'customer',
  `first_name` VARCHAR(191) NULL,
  `last_name` VARCHAR(191) NULL,
  `company` VARCHAR(191) NULL,
  `phone` VARCHAR(191) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `users_email_key` (`email`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` VARCHAR(191) NOT NULL,
  `user_id` INTEGER NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `role` ENUM('customer', 'b2b', 'admin') NOT NULL,
  `user_agent` VARCHAR(191) NULL,
  `ip_address` VARCHAR(191) NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_seen_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `expires_at` DATETIME(3) NOT NULL,
  `revoked_at` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  INDEX `sessions_user_id_revoked_at_idx` (`user_id`, `revoked_at`),
  CONSTRAINT `sessions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `user_id` INTEGER NULL,
  `email` VARCHAR(191) NULL,
  `status` VARCHAR(191) NOT NULL DEFAULT 'pending',
  `total` DECIMAL(10, 2) NOT NULL,
  `stripe_payment_id` VARCHAR(191) NULL,
  `stripe_session_id` VARCHAR(191) NULL,
  `invoice_number` VARCHAR(191) NULL,
  `invoice_path` VARCHAR(191) NULL,
  `shipping_address` TEXT NULL,
  `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  INDEX `orders_user_id_idx` (`user_id`),
  CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `order_id` INTEGER NOT NULL,
  `turbo_id` INTEGER NOT NULL,
  `sku` VARCHAR(191) NULL,
  `name` VARCHAR(191) NULL,
  `quantity` INTEGER NOT NULL,
  `unit_price` DECIMAL(10, 2) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `order_items_order_id_idx` (`order_id`),
  INDEX `order_items_turbo_id_idx` (`turbo_id`),
  CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `order_items_turbo_id_fkey` FOREIGN KEY (`turbo_id`) REFERENCES `turbos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `ip_blocks` (
  `id` INTEGER NOT NULL AUTO_INCREMENT,
  `ip_address` VARCHAR(191) NOT NULL,
  `reason` VARCHAR(191) NOT NULL,
  `redirect_url` VARCHAR(191) NULL,
  `blocked_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE INDEX `ip_blocks_ip_address_key` (`ip_address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
