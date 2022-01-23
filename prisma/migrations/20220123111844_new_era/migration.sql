/*
  Warnings:

  - You are about to drop the `Example` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `Site` ADD COLUMN `contract` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `Example`;

-- DropTable
DROP TABLE `Post`;

-- CreateTable
CREATE TABLE `Token` (
    `id` VARCHAR(191) NOT NULL,
    `title` TEXT NULL,
    `description` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `siteId` VARCHAR(191) NULL,

    UNIQUE INDEX `Token_id_siteId_key`(`id`, `siteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
